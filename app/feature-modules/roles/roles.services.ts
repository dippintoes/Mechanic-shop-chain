import rolesRepo from "./roles.repo";
import { ROLE_RESPONSES } from "./roles.responses";
import { IRole } from "./roles.types";

const createRole = (role: IRole) => {
  const newRole = rolesRepo.create(role);
  return newRole;
};

const findRole = async () => {
  const allRoles = await rolesRepo.find();
  if (!allRoles) throw ROLE_RESPONSES.NO_ROLES_YET;
  return allRoles;
};

const deleteRole = async (id: string) => {
  const role = await rolesRepo.deleteRole(id);
  if (!role) throw ROLE_RESPONSES.ROLE_NOT_FOUND;
  return role;
};

export default {
  createRole,
  findRole,
  deleteRole,
};
