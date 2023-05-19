import mongoose, { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import rewardsRepo from "./rewards.repo";
import { IReward } from "./rewards.types";
import { REWARDS_RESPONSES } from "./rewards.responses";
import { generatePipeline } from "../../utility/generatePipeline";
import userServices from "../user/user.services";
import { USER_RESPONSES } from "../user/user.responses";
import shopServices from "../shop/shop.services";
import redeemService from "../redeem/redeem.service";
import redeemRepo from "../redeem/redeem.repo";

const createReward = async (reward: IReward) => {
  const record = await rewardsRepo.create(reward);
  console.log(record);
  return { ...REWARDS_RESPONSES.CREATED, record };
};

const findReward = async (filter: FilterQuery<IReward>) => {
  const record = await rewardsRepo.findOne({ ...filter, isDeleted: false });
  if (!record) throw REWARDS_RESPONSES.REWARD_NOT_FOUND;
  return record;
};

const approveReward = async (id: string) => {
  const request = await redeemService.findRequest(id);

  const isRdeemed = await redeemRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    {
      $set: { isRedeemed: true },
    }
  );

  await shopServices.updateShop(
    { _id: request.shop_id },
    { $push: { rewards: request.reward } }
  );

  return isRdeemed;

  // return USER_RESPONSES.APPROVED_REDEEM_SUCCESSFULL;
};

const findAllRewards = async (query: any, stages: PipelineStage[]) => {
  const pipeline: PipelineStage[] = generatePipeline(query);
  pipeline.concat(stages);
  console.log(pipeline);
  const records = await rewardsRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...pipeline,
  ]);
  if (records.length === 0) throw REWARDS_RESPONSES.NO_REWARDS;
  return records;
};

const updateReward = async (id: string, update: UpdateQuery<IReward>) => {
  const record = await rewardsRepo.update(
    { _id: new mongoose.mongo.ObjectId(id), isDeleted: false },
    update
  );
  if (!record) throw REWARDS_RESPONSES.NO_REWARDS;
  return REWARDS_RESPONSES.UPDATE_SUCCESSFULL;
};

const showAvailableRewards = async (filter: any, id: string) => {
  const pipeline: PipelineStage[] = generatePipeline(filter);
  const user = await userServices.findUser({
    _id: new mongoose.mongo.ObjectId(id),
  });
  if (!user) throw USER_RESPONSES.NOT_FOUND;
  const shop = await shopServices.findShop({
    "shop_keeper.email": user.email,
  });
  const rewards = await rewardsRepo.aggregate([
    {
      $match: {
        points: { $lte: shop.points },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        points: 1,
      },
    },
    ...pipeline,
  ]);
  const upcoming = await rewardsRepo.aggregate([
    {
      $match: {
        points: { $gt: shop.points },
      },
    },
    {
      $sort: {
        points: 1,
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        points: 1,
      },
    },
    ...pipeline,
  ]);
  const upcoming_reward = upcoming[0];
  return {
    "ELIGIBLE REWARDS: ": rewards,
    "UPCOMING REWARD: ": upcoming_reward,
    "POINTS REMAINING TO UNLOCK NEXT REWARD: ":
      upcoming_reward.points - shop.points,
  };
};

const deletReward = async (id: string) => {
  const record = await rewardsRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    { isDeleted: true }
  );
  if (!record) throw REWARDS_RESPONSES.REWARD_NOT_FOUND;
  return REWARDS_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createReward,
  findReward,
  approveReward,
  findAllRewards,
  updateReward,
  deletReward,
  showAvailableRewards,
};
