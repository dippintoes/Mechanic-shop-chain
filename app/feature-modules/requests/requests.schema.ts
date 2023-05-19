import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/baseSchema";
import { IRequest } from "./requests.types";

const RequestsSchema = new BaseSchema({
  shop_id: {
    type: Schema.Types.Mixed,
    required: false,
    ref: "shops",
  },
  requests: [
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
      isApproved: {
        type: Boolean,
        // required: true,
        default: false,
      },
    },
  ],
});

type RequestDocument = Document & IRequest;

export const RequestModel = model<RequestDocument>("requests", RequestsSchema);
