import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IRedeem } from "./redeem.types";
import { RedeemModel } from "./redeem.schema";

const create = async (request: IRedeem) => await RedeemModel.create(request);

const findOne = async (filter: FilterQuery<IRedeem>) =>
  await RedeemModel.findOne(filter);

const aggregate = (pipeline: PipelineStage[]) =>
  RedeemModel.aggregate(pipeline);

const update = async (
  filter: FilterQuery<IRedeem>,
  update: UpdateQuery<IRedeem>
) => await RedeemModel.updateOne(filter, update);

export default {
  create,
  findOne,
  aggregate,
  update,
};
