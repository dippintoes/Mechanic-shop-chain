import { ObjectId } from "bson";

export interface IRating {
  _id?: String | ObjectId;
  shop_id: String | ObjectId;
  rating: number;
}
