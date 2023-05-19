import { ObjectId } from "bson";

export interface IRedeem {
  shop_id?: string | ObjectId;
  reward: string | ObjectId;
  isRedeemed: boolean;
}
