import {
  FilterQuery,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { IRequest } from "./requests.types";
import { RequestModel } from "./requests.schema";

const create = async (request: IRequest) =>
  await (await RequestModel.create(request)).populate("requests.part");

const findOne = async (filter: FilterQuery<IRequest>) =>
  await RequestModel.findOne(filter).populate("requests.part");
const aggregate = (pipeline: PipelineStage[]) =>
  RequestModel.aggregate(pipeline);

const update = async (
  filter: FilterQuery<IRequest>,
  update: UpdateQuery<IRequest>
) => await RequestModel.updateOne(filter, update);

const updateMany = async (
  filter: FilterQuery<IRequest>,
  update: UpdateQuery<IRequest>,
  options: QueryOptions
) => {
  await RequestModel.updateMany(filter, update, options);
};

export default {
  create,
  findOne,
  aggregate,
  update,
  updateMany,
};
