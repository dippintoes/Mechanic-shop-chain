import { BaseSchema } from "../../utility/baseSchema";
import { Schema, model } from "mongoose";
import { IRating } from "./ratings.types";

const RateSchema = new BaseSchema({
  shop_id: {
    type: Schema.Types.Mixed,
    ref: "Shops",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

type RatingDocument = Document & IRating;

export const RatingModel = model<RatingDocument>("ratings", RateSchema);
