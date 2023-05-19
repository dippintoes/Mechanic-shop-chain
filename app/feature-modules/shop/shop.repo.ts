import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { ShopModel } from "./shop.schema";
import { IShop } from "./shop.types";

const create = async (shop: IShop) =>
  (await ShopModel.create(shop)).populate("inventory.part");

const findOne = async (filter: FilterQuery<IShop>) =>
  await ShopModel.findOne({ ...filter });

const aggregate = (pipeline: PipelineStage[]) => ShopModel.aggregate(pipeline);

const update = async (filter: FilterQuery<IShop>, update: UpdateQuery<IShop>) =>
  await ShopModel.updateOne(filter, update);

export default {
  create,
  findOne,
  aggregate,
  update,
};
