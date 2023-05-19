import mongoose, { PipelineStage, Types, UpdateQuery } from "mongoose";
import { ISale } from "./sales.types";
import salesRepo from "./sales.repo";
import { SALES_RESPONSES } from "./sales.responses";
import shopServices from "../shop/shop.services";
import inventoryServices from "../inventory/inventory.services";
import { generatePipeline } from "../../utility/generatePipeline";
import { SHOP_RESPONSES } from "../shop/shop.responses";
import shopRepo from "../shop/shop.repo";

const createSale = async (id: string, sale: ISale) => {
  sale.shop_id = new mongoose.mongo.ObjectId(id);
  sale.total = 0;

  for (let part of sale.sold_products) {
    part.part = new mongoose.mongo.ObjectId(part.part);
    const partDetails = await inventoryServices.findPart({ _id: part.part });
    const partPrice = partDetails.price;
    sale.total += partPrice * part.qty;
  }
  await salesRepo.create(sale);

  for (let part of sale.sold_products) {
    const partDetails = await inventoryServices.findPart({ _id: part.part });
    const req = await shopServices.updateShop(
      {
        _id: sale.shop_id,
        inventory: {
          $elemMatch: {
            part: part.part,
            outOfStock: false,
          },
        },
      },
      {
        $inc: {
          "inventory.$.qty": -part.qty,
          "inventory.$.sold": part.qty,
          revenue: sale.total,
        },
      }
    );

    if (partDetails.isSpecial) {
      await shopServices.updateShop(
        {
          _id: sale.shop_id,
          "inventory.part": part.part,
        },
        {
          $inc: {
            points: partDetails.points,
          },
        }
      );
    }

    const outofstack = await shopServices.updateShop(
      {
        _id: sale.shop_id,
        "inventory.qty": {
          $lte: 0,
        },
      },
      {
        $set: {
          "inventory.$.outOfStock": true,
        },
      }
    );

    if (outofstack.record.matchedCount === 1 || req.record.matchedCount === 0) {
      throw SALES_RESPONSES.OUT_OF_STOCK;
    }

    const aggregate = await shopRepo.aggregate([
      {
        $match: {
          _id: sale.shop_id,
          "inventory.qty": { $lt: partDetails.min_qty },
        },
      },
    ]);
    console.log("aggregate: ", aggregate);

    if (aggregate.length === 1) {
      return { ...SALES_RESPONSES.RNNING_LOW, sale };
    }
  }
  return { ...SALES_RESPONSES.CREATED, sale };
};

const findSale = async (id: string) => {
  const record = await salesRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
    isDeleted: false,
  });
  if (!record) throw SALES_RESPONSES.NOT_FOUND;
  return record;
};

const monthlyRevenue = async (query: any) => {
  const { startDate, endDate, shopId, ...filter } = query;
  let pipeline = generatePipeline(filter);
  const aggregate = [];
  if (query.startDate) {
    aggregate.push({
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    });
  }
  if (query.shopId) {
    aggregate.push({
      $group: {
        _id: new mongoose.mongo.ObjectId(query.shopId),
        monthlyRevenue: { $sum: "$total" },
      },
    });
  }
  const pipe = [...aggregate, ...pipeline];
  const result = await salesRepo.aggregate(pipe);
  if (result.length === 0) {
    throw SHOP_RESPONSES.NO_MATCH;
  }
  return result;
};

const findAllSales = async (query: any, stages: PipelineStage[]) => {
  const { shop_id, ...filter } = query;
  const pipeline: PipelineStage[] = generatePipeline(filter);
  const aggregate: PipelineStage[] = [];
  if (shop_id) {
    aggregate.push({
      $match: {
        shop_id: new Types.ObjectId(shop_id),
      },
    });
  }
  const records = await salesRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...aggregate,
    {
      $project: {
        _id: 0,
        customer: 1,
        shop_id: 1,
        sold_products: 1,
      },
    },
    {
      $unwind: "$sold_products",
    },
    {
      $lookup: {
        from: "shops",
        localField: "shop_id",
        foreignField: "_id",
        as: "shop_details",
      },
    },
    {
      $lookup: {
        from: "inventories",
        localField: "sold_products.part",
        foreignField: "_id",
        as: "item_details",
      },
    },
    {
      $project: {
        _id: 0,
        "shop_details.shop_name": 1,
        "shop_details.shop_keeper": 1,
        "item_details.spare_part": 1,
        "sold_products.qty": 1,
      },
    },
    ...stages,
    ...pipeline,
  ]);
  if (records.length === 0) throw SALES_RESPONSES.No_Sales;
  return records;
};

const findHighestSellingItem = async (query: any) => {
  const stages: PipelineStage[] = [];
  const group = {
    $group: {
      _id: "$item_details.spare_part",
      Total_Sales: { $sum: "$sold_products.qty" },
    },
  };
  stages.push(group);
  const shops = await findAllSales(query, stages);
  return shops;
};

const updateSale = async (id: string, update: UpdateQuery<ISale>) => {
  const record = await salesRepo.update(
    { _id: new mongoose.mongo.ObjectId(id), isDeleted: false },
    update
  );
  if (!record) throw SALES_RESPONSES.NOT_FOUND;
  return SALES_RESPONSES.UPDATE_SUCCESSFULL;
};

const deleteSale = async (id: string) => {
  const record = await salesRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    { isDeleted: true }
  );

  const sale = await salesRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
  });
  if (!sale) throw SALES_RESPONSES.NOT_FOUND;

  for (let part of sale.sold_products) {
    await shopServices.updateShop(
      {
        _id: sale.shop_id,
        "inventory.part": part.part,
      },
      {
        $inc: { "inventory.$.qty": part.qty, "inventory.$.sold": -part.qty },
      }
    );

    const partItem = await inventoryServices.findPart({ _id: part.part });

    await shopServices.updateShop(
      {
        _id: sale.shop_id,
        inventory: {
          $elemMatch: {
            part: part.part,
            qty: { $gte: partItem.min_qty },
          },
        },
      },
      {
        $set: {
          "inventory.$.outOfStock": false,
        },
      }
    );
  }

  if (!record) throw SALES_RESPONSES.NOT_FOUND;
  return SALES_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createSale,
  findHighestSellingItem,
  findSale,
  findAllSales,
  monthlyRevenue,
  updateSale,
  deleteSale,
};
