import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/baseSchema";
import { ISale } from "./sales.types";

const SalesSchema = new BaseSchema({
  customer: {
    type: String,
    required: true,
  },
  shop_id: {
    type: Schema.Types.Mixed,
    required: true,
    ref: "shops",
  },
  sold_products: [
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
    },
  ],
  total: {
    type: Number,
    required: true,
  },
});

type SaleDocument = ISale & Document;

export const SalesModel = model<SaleDocument>("sales", SalesSchema);
