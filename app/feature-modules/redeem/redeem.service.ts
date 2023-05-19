import mongoose, {
  FilterQuery,
  PipelineStage,
  Types,
  UpdateQuery,
} from "mongoose";
import requestsRepo from "./redeem.repo";
import { REDEEM_RESPONSES } from "./redeem.responses";
import { INVENTORY_RESPONSES } from "../inventory/inventory.responses";
import { IRedeem } from "./redeem.types";
import redeemRepo from "./redeem.repo";
import { generatePipeline } from "../../utility/generatePipeline";
import userServices from "../user/user.services";
import { USER_RESPONSES } from "../user/user.responses";
import shopServices from "../shop/shop.services";
import rewardsServices from "../rewards/rewards.services";
import { REWARDS_RESPONSES } from "../rewards/rewards.responses";

const createRequest = async (id: string, request: IRedeem) => {
  request.shop_id = new mongoose.mongo.ObjectId(id);
  request.reward = new mongoose.mongo.ObjectId(request.reward);
  const record = await requestsRepo.create(request);
  return { ...REDEEM_RESPONSES.CREATED, record };
};

const redeemReward = async (id: string, request: IRedeem) => {
  const user = await userServices.findUser({
    _id: new mongoose.mongo.ObjectId(id),
  });
  if (!user) throw USER_RESPONSES.NOT_FOUND;
  const shop = await shopServices.findShop({
    "shop_keeper.email": user.email,
  });
  const reward = await rewardsServices.findReward({
    _id: new mongoose.mongo.ObjectId(request.reward),
  });
  id = shop._id.toString();
  if (shop.isValid === false) {
    throw USER_RESPONSES.INVALIDATED_REVENUE;
  } else {
    if (shop.points >= reward.points) {
      const record = await createRequest(id, request);
      await shopServices.updateShop(
        { _id: shop._id },
        {
          $inc: { points: -reward.points },
        }
      );
      return { ...USER_RESPONSES.REDEEM_SUCCESSFULL, record };
    } else {
      throw REWARDS_RESPONSES.LOCKED_REWARD;
    }
  }
};

const findRequest = async (id: string) => {
  const record = await redeemRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
    isDeleted: false,
  });
  if (!record) throw REDEEM_RESPONSES.REQUEST_NOT_FOUND;
  return record;
};

const findAllRequests = async (query: any, stages: PipelineStage[]) => {
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
  const records = await redeemRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...aggregate,
    {
      $project: {
        shop_id: 1,
        reward: 1,
        isRedeemed: 1,
      },
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
        from: "rewards",
        localField: "reward",
        foreignField: "_id",
        as: "reward_details",
      },
    },
    {
      $project: {
        _id: 0,
        "shop_details.shop_name": 1,
        isRedeemed: 1,
        "shop_details.points": 1,
        "reward_details.name": 1,
        "reward_details.points": 1,
      },
    },
    ...stages,
    ...pipeline,
  ]);
  if (records.length === 0) throw REDEEM_RESPONSES.NO_REQUESTS;
  return records;
};

const updateRequest = async (
  filter: FilterQuery<IRedeem>,
  update: UpdateQuery<IRedeem>
) => {
  const record = await redeemRepo.update(
    { ...filter, isDeleted: false },
    { update }
  );
  if (!record) throw REDEEM_RESPONSES.NO_REQUESTS;
  return record;
};

const deleteRequest = async (id: string) => {
  const record = await redeemRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    { isDeleted: true }
  );
  if (!record) throw INVENTORY_RESPONSES.NOT_FOUND;
  return REDEEM_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createRequest,
  redeemReward,
  findRequest,
  findAllRequests,
  updateRequest,
  deleteRequest,
};
