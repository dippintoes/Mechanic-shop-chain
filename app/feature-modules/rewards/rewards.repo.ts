import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { RewardsModel } from "./rewards.schema";
import { IReward } from "./rewards.types";

const create = (reward: IReward) => RewardsModel.create(reward);

const findOne = async (filter: FilterQuery<IReward>) =>
  await RewardsModel.findOne({ ...filter, isDeleted: false });

const aggregate = (pipeline: PipelineStage[]) =>
  RewardsModel.aggregate(pipeline);

const update = async (
  filter: FilterQuery<IReward>,
  update: UpdateQuery<IReward>
) => await RewardsModel.updateOne(filter, update);

export default {
  create,
  aggregate,
  findOne,
  update,
};
