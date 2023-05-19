import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IRating } from "./ratings.types";
import { RatingModel } from "./ratings.schema";

const create = async (rating: IRating) => await RatingModel.create(rating);

const findOne = async (filter: FilterQuery<IRating>) =>
  await RatingModel.findOne(filter);

const update = async (
  filter: FilterQuery<IRating>,
  update: UpdateQuery<IRating>
) => {
  await RatingModel.updateOne(filter, update);
};

const aggregate = (pipeline: PipelineStage[]) =>
  RatingModel.aggregate(pipeline);

const find = async (filter: FilterQuery<IRating>) =>
  await RatingModel.find(filter);

export default {
  create,
  update,
  findOne,
  aggregate,
  find,
};
