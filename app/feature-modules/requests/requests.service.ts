import mongoose, { PipelineStage, Types, UpdateQuery } from "mongoose";
import { ObjectId } from "bson";
import { IRequest } from "./requests.types";
import requestsRepo from "./requests.repo";
import { REQUEST_RESPONSES } from "./requests.responses";
import shopServices from "../shop/shop.services";
import { RequestModel } from "./requests.schema";
import { generatePipeline } from "../../utility/generatePipeline";
import inventoryServices from "../inventory/inventory.services";

const createRequest = async (id: string, request: IRequest) => {
  request.shop_id = new mongoose.mongo.ObjectId(id);
  for (let part of request.requests) {
    part.part = new mongoose.mongo.ObjectId(part.part);
  }
  const record = await requestsRepo.create(request);
  return { ...REQUEST_RESPONSES.CREATED, record };
};

const approveRequest = async (
  reqid: string,
  objectIdArray: string[] | ObjectId[]
) => {
  const foundReq = await requestsRepo.findOne({
    _id: new mongoose.mongo.ObjectId(reqid),
  });

  if (!foundReq?.shop_id) throw REQUEST_RESPONSES.NO_REQUESTS;
  const shop = await shopServices.findShop({
    _id: new mongoose.mongo.ObjectId(foundReq.shop_id.toString()),
  });

  const filter = {
    _id: new mongoose.mongo.ObjectId(reqid),
    "requests._id": { $in: objectIdArray },
  };

  const reqs = await RequestModel.find(filter);

  await requestsRepo.updateMany(
    filter,
    {
      $set: { "requests.$[elem].isApproved": true },
    },
    {
      arrayFilters: [{ "elem._id": { $in: objectIdArray } }],
    }
  );

  for (let item of reqs[0].requests) {
    const result = await shopServices.updateShop(
      { _id: shop._id, "inventory.part": { $ne: item.part } },
      { $addToSet: { inventory: { part: item.part, qty: item.qty } } }
    );

    if (result.record.modifiedCount === 0) {
      await shopServices.updateShop(
        { _id: shop._id, "inventory.part": item.part },
        {
          $inc: { "inventory.$.qty": item.qty },
        }
      );
    }
    const spare_part = await inventoryServices.findPart({
      _id: new mongoose.mongo.ObjectId(item.part),
    });

    await shopServices.updateShop(
      {
        _id: shop._id,
        inventory: {
          $elemMatch: {
            part: item.part,
            qty: { $gte: spare_part.min_qty },
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
  return shop;
};

const findRequest = async (id: string) => {
  const record = await requestsRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
    isDeleted: false,
  });
  if (!record) throw REQUEST_RESPONSES.REQUEST_NOT_FOUND;
  return record;
};

const findAllRequests = async (query: any, stages: PipelineStage[]) => {
  const { isApproved, shop_id, ...filter } = query;
  const pipeline: PipelineStage[] = generatePipeline(filter);
  const aggregate: PipelineStage[] = [];
  if (isApproved) {
    console.log(isApproved);
    aggregate.push({
      $match: {
        "requests.isApproved": Boolean(isApproved),
      },
    });
  }
  if (shop_id) {
    aggregate.push({
      $match: {
        shop_id: new Types.ObjectId(shop_id),
      },
    });
  }
  const records = await requestsRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...aggregate,
    {
      $project: {
        shop_id: 1,
        requests: 1,
      },
    },
    {
      $unwind: "$requests",
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
        localField: "requests.part",
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
        "requests.qty": 1,
        "requests.isApproved": 1,
      },
    },
    ...stages,
    ...pipeline,
  ]);
  if (records.length === 0) throw REQUEST_RESPONSES.NO_REQUESTS;
  return records;
};

const updateRequest = async (id: string, update: UpdateQuery<IRequest>) => {
  const record = await requestsRepo.update(
    { _id: new mongoose.mongo.ObjectId(id), isDeleted: false },
    update
  );
  console.log(record);
  if (!record) throw REQUEST_RESPONSES.REQUEST_NOT_FOUND;
  return REQUEST_RESPONSES.UPDATE_SUCCESSFULL;
};

const deleteRequest = async (id: string) => {
  const record = await requestsRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    { isDeleted: true }
  );
  if (!record) throw REQUEST_RESPONSES.REQUEST_NOT_FOUND;
  return REQUEST_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createRequest,
  approveRequest,
  findRequest,
  findAllRequests,
  updateRequest,
  deleteRequest,
};
