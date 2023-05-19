import { ObjectId } from "bson";

export interface IRequest {
  shop_id?: string | ObjectId;
  requests: req[];
}

export type req = {
  _id?: ObjectId | string;
  part: string | ObjectId;
  qty: number;
  isApproved: boolean;
};

export type Requests = IRequest[];
