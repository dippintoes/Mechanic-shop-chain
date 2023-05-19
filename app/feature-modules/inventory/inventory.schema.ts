import { model } from "mongoose";
import { BaseSchema } from "../../utility/baseSchema";
import { IInventory } from "./inventory.types";

const InventorySchema = new BaseSchema({
  spare_part: {
    type: String,
    required: true,
  },
  min_qty: {
    type: Number,
    required: true,
    default: "10",
  },
  price: {
    type: Number,
    required: true,
  },
  isSpecial: {
    type: Boolean,
    required: true,
    default: false,
  },
  points: {
    type: Number,
    required: false,
    default: 0,
  },
});

type InventoryDocument = Document & IInventory;

export const InventoryModel = model<InventoryDocument>(
  "inventory",
  InventorySchema
);
