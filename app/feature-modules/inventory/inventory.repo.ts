import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IInventory } from "./inventory.types";
import { InventoryModel } from "./inventory.schema";

const create = (shop: IInventory) => InventoryModel.create(shop);

const aggregate = (pipeline: PipelineStage[]) =>
  InventoryModel.aggregate(pipeline);

const findOne = async (filter: FilterQuery<IInventory>) =>
  await InventoryModel.findOne(filter);

const update = async (
  filter: FilterQuery<IInventory>,
  update: UpdateQuery<IInventory>
) => await InventoryModel.updateOne(filter, update);

export default {
  create,
  findOne,
  aggregate,
  update,
};
