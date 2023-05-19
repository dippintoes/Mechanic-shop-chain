import { ObjectId } from "bson";
import { IUser } from "../user/user.types";

export interface IShop {
  shop_name: string;
  location: string;
  shop_keeper: IUser;
  ratings?: number;
  inventory: IPart[];
  points: number;
  revenue: number;
  total_revenue: number;
  isValid: boolean;
  rewards: ObjectId[];
}

export type IPart = {
  part: ObjectId | string;
  qty: number;
  sold: number;
  outOfStock: boolean;
};
