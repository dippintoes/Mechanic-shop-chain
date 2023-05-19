import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/baseSchema";
import { IShop } from "./shop.types";

const ShopSchema = new BaseSchema({
  shop_name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  shop_keeper: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  ratings: {
    type: Number,
    required: false,
    default: 0,
  },
  points: {
    type: Number,
    required: false,
    default: 0,
  },
  revenue: {
    type: Number,
    required: false,
    default: 0,
  },
  total_revenue: {
    type: Number,
    required: false,
    default: 0,
  },
  isValid: {
    type: Boolean,
    required: true,
    default: false,
  },
  rewards: [
    {
      type: Schema.Types.ObjectId,
      required: false,
    },
  ],
  inventory: [
    {
      part: {
        type: Schema.Types.Mixed,
        required: true,
        ref: "inventory",
      },
      qty: {
        type: Number,
        required: true,
      },
      sold: {
        type: Number,
        required: true,
        default: 0,
      },
      outOfStock: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

type ShopDocment = Document & IShop;

export const ShopModel = model<ShopDocment>("shops", ShopSchema);
