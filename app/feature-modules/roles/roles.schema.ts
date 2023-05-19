import { model } from "mongoose";
import { IRole } from "./roles.types";
import { BaseSchema } from "../../utility/baseSchema";

const RoleSchema = new BaseSchema({
  role: {
    type: String,
    required: true,
  },
});

type RoleDocument = IRole & Document;

export const RoleModel = model<RoleDocument>("roles", RoleSchema);
