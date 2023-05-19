import { ObjectId } from "bson";

export interface ISale {
  customer: string;
  shop_id: ObjectId | string;
  sold_products: sold_products[];
  total: number;
}

type sold_products = {
  part: ObjectId | string;
  qty: number;
};
