import mongoose, { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import shopRepo from "./shop.repo";
import { IShop } from "./shop.types";
import { SHOP_RESPONSES } from "./shop.responses";
import authServices from "../auth/auth.services";
import userServices from "../user/user.services";
import ratingsServices from "../ratings/ratings.services";
import { generatePipeline } from "../../utility/generatePipeline";
import redeemService from "../redeem/redeem.service";
import requestsService from "../requests/requests.service";
import salesService from "../sales/sales.service";
import rewardsServices from "../rewards/rewards.services";
import { RATING_RESPONSES } from "../ratings/ratings.responses";

const createShop = async (shop: IShop) => {
  const new_shop_keeper = await authServices.register(shop.shop_keeper);
  shop.shop_keeper = new_shop_keeper;
  shop.inventory = [];
  const record = await shopRepo.create(shop);
  return { ...SHOP_RESPONSES.CREATED, record };
};

const validateRevenue = async (id: string, amount: number) => {
  const shop = await shopRepo.findOne({ _id: new mongoose.mongo.ObjectId(id) });
  if (amount === shop?.revenue) {
    await shopRepo.update(
      { _id: new mongoose.mongo.ObjectId(id) },
      {
        $set: {
          isValid: true,
          revenue: 0,
        },
        $inc: {
          total_revenue: shop.revenue,
        },
      }
    );
  } else {
    await shopRepo.update(
      { _id: new mongoose.mongo.ObjectId(id) },
      {
        $set: {
          isValid: false,
          points: 0,
          revenue: 0,
        },
      }
    );
    return { message: "Revenue mismatch", statusCode: 401 };
  }
  return SHOP_RESPONSES.SHOP_VALIDATED_SUCCESSFULLY;
};

const monthlyRevenue = async (query: any) => {
  const record = await salesService.monthlyRevenue(query);
  return record;
};

const findShop = async (filter: FilterQuery<IShop>) => {
  const record = await shopRepo.findOne({ ...filter, isDeleted: false });
  if (!record) throw SHOP_RESPONSES.NOT_FOUND;
  return record;
};

const findHighestSellers = async (query: FilterQuery<IShop>, id: string) => {
  const stages: PipelineStage[] = [];
  const shop = await shopRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
    isDeleted: false,
  });
  if (!shop) throw SHOP_RESPONSES.NOT_FOUND;
  const pipeline: PipelineStage[] = generatePipeline(query);
  const matchingCondition: PipelineStage = {
    $match: { shop_id: shop?._id },
  };
  const unwind: PipelineStage = {
    $unwind: "$inventory",
  };
  const project: PipelineStage = {
    $project: {
      _id: 0,
      shop_name: 1,
      "inventory.part": 1,
      "inventory.qty": 1,
      "inventory.sold": 1,
      "inventory.outOfStack": 1,
    },
  };
  stages.push(matchingCondition, unwind, project);
  const records = await shopRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...stages,
    ...pipeline,
  ]);
  if (records.length === 0) throw SHOP_RESPONSES.NO_SHOPS;
  return records;
};

const findAllShops = async (query: any) => {
  const pipeline: PipelineStage[] = generatePipeline(query);
  const records = await shopRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $project: {
        _id: 0,
        shop_name: 1,
        location: 1,
        shopkeeper: 1,
        ratings: 1,
        points: 1,
        rewards: 1,
        revenue: 1,
        total_revenue: 1,
        inventory: 1,
      },
    },
    ...pipeline,
  ]);
  if (records.length === 0) throw SHOP_RESPONSES.NO_SHOPS;
  return records;
};

const findAllRatings = async (query: Object) => {
  const records = await ratingsServices.findAllRatings(query);
  if (records.length === 0) throw RATING_RESPONSES.NO_MATCH;
  return records;
};

const findMyRedeemRequests = async (query: Object, id: string) => {
  const stages: PipelineStage[] = [];
  const records = await redeemService.findAllRequests(query, stages);
  return records;
};

const showAvailableRewards = async (filter: any, id: string) =>
  await rewardsServices.showAvailableRewards(filter, id);

const findMyRequests = async (query: any, id: string) => {
  const stages: PipelineStage[] = [];
  const records = await requestsService.findAllRequests(query, stages);
  return records;
};

const aggregate = async (pipeline: PipelineStage[]) =>
  await shopRepo.aggregate(pipeline);

const findHighestSellingItem = async (query: any) => {
  const record = await salesService.findHighestSellingItem(query);
  if (record.length === 0) throw SHOP_RESPONSES.NO_MATCH;
  return record;
};

const updateShop = async (
  filter: FilterQuery<IShop>,
  update: UpdateQuery<IShop>
) => {
  const record = await shopRepo.update(filter, update);
  if (!record) throw SHOP_RESPONSES.NOT_FOUND;
  return { ...SHOP_RESPONSES.UPDATE_SUCCESSFULL, record };
};

const deletShop = async (id: string) => {
  const record = await shopRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    { isDeleted: true }
  );
  const shop = await shopRepo.findOne({ _id: new mongoose.mongo.ObjectId(id) });
  await userServices.deleteUser({
    name: shop?.shop_keeper.name,
  });
  if (!record) throw SHOP_RESPONSES.NOT_FOUND;
  return SHOP_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createShop,
  validateRevenue,
  findShop,
  findHighestSellingItem,
  monthlyRevenue,
  aggregate,
  findAllShops,
  findAllRatings,
  showAvailableRewards,
  findMyRequests,
  updateShop,
  deletShop,
  findMyRedeemRequests,
};
