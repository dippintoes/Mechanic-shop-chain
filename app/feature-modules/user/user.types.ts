import { ObjectId } from "bson";

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role?: ObjectId | String;
}
