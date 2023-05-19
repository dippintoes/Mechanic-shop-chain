import { Types } from "mongoose";
import { RoleModel } from "./roles.schema";
import { IRole } from "./roles.types";

const create = (role: IRole) => RoleModel.create(role);

const find = () => RoleModel.find();

const deleteRole = (id: string) =>
  RoleModel.updateOne(
    {
      _id: new Types.ObjectId(id),
    },
    {
      isDeleted: true,
    }
  );

export default {
  create,
  find,
  deleteRole,
};
