import mongoose, { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import inventoryRepo from "./inventory.repo";
import { IInventory } from "./inventory.types";
import { INVENTORY_RESPONSES } from "./inventory.responses";
import { generatePipeline } from "../../utility/generatePipeline";

const createPart = async (part: IInventory) => {
  const record = await inventoryRepo.create(part);
  return { ...INVENTORY_RESPONSES.CREATED, record };
};

const findPart = async (filter: FilterQuery<IInventory>) => {
  const record = await inventoryRepo.findOne({ ...filter, isDeleted: false });
  if (!record) throw INVENTORY_RESPONSES.NOT_FOUND;
  return record;
};

const findAllParts = async (query: any) => {
  const pipeline: PipelineStage[] = generatePipeline(query);
  const records = await inventoryRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...pipeline,
  ]);
  if (records.length === 0) throw INVENTORY_RESPONSES.NO_MATCH;
  return records;
};

const updatePart = async (
  filter: FilterQuery<IInventory>,
  update: UpdateQuery<IInventory>
) => {
  const record = await inventoryRepo.update(filter, update);
  if (!record) throw INVENTORY_RESPONSES.NOT_FOUND;
  return INVENTORY_RESPONSES.UPDATE_SUCCESSFULL;
};

const deletPart = async (id: string) => {
  const record = await inventoryRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    { isDeleted: true }
  );
  if (!record) throw INVENTORY_RESPONSES.NOT_FOUND;
  return INVENTORY_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createPart,
  findPart,
  findAllParts,
  updatePart,
  deletPart,
};
