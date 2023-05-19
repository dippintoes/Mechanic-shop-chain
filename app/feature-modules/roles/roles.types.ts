import mongoose from "mongoose";

export const Roles = {
  ADMIN: new mongoose.mongo.ObjectId("64484df4224bdffff93bc8c8"),
  SHOPKEEPER: new mongoose.mongo.ObjectId("64484dfc224bdffff93bc8ca"),
};

export interface IRole {
  _id?: string;
  role: string;
}

export type Roles = IRole[];
