import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/baseSchema";
import { IRedeem } from "./redeem.types";

const RedeemSchema = new BaseSchema({
  shop_id: {
    type: Schema.Types.Mixed,
    required: false,
    ref: "shops",
  },
  reward: {
    type: Schema.Types.Mixed,
    required: true,
    ref: "rewards",
  },
  isRedeemed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

type RedeemDocument = Document & IRedeem;

export const RedeemModel = model<RedeemDocument>("redeems", RedeemSchema);
