import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { UserModel } from "./user.schema";
import { IUser } from "./user.types";

const create = async (user: IUser) => await UserModel.create(user);

const update = async (filter: FilterQuery<IUser>, update: UpdateQuery<IUser>) =>
  await UserModel.findOneAndUpdate(filter, update);

const findOne = async (filter: FilterQuery<IUser>) =>
  await UserModel.findOne({ ...filter, isDeleted: false });

const aggregate = (pipeline: PipelineStage[]) => UserModel.aggregate(pipeline);

export default {
  create,
  findOne,
  update,
  aggregate,
};
