import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/baseSchema";
import { IUser } from "./user.types";
import { Roles } from "../roles/roles.types";

const UserSchema = new BaseSchema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.Mixed,
    required: false,
    default: Roles.SHOPKEEPER.toString(),
    ref: "roles",
  },
});

type UserDocument = Document & IUser;

export const UserModel = model<UserDocument>("users", UserSchema);
