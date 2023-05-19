import { model } from "mongoose";
import { BaseSchema } from "../../utility/baseSchema";
import { IReward } from "./rewards.types";

const RewardsSchema = new BaseSchema({
  name: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
});

type RewardsDocument = Document & IReward;

export const RewardsModel = model<RewardsDocument>("Rewards", RewardsSchema);
