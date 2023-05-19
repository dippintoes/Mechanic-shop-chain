import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { ISale } from "./sales.types";
import { SalesModel } from "./sales.schema";

const create = async (sale: ISale) =>
  await (await SalesModel.create(sale)).populate("sold_products.part");

const findOne = async (filter: FilterQuery<ISale>) =>
  await SalesModel.findOne(filter);

const aggregate = (pipeline: PipelineStage[]) => SalesModel.aggregate(pipeline);

const update = async (filter: FilterQuery<ISale>, update: UpdateQuery<ISale>) =>
  await SalesModel.updateOne(filter, update);

export default {
  create,
  findOne,
  aggregate,
  update,
};
