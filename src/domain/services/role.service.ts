import { dbClient } from "../../data";
import { CurrentUserDto } from "../dtos/auth";
import { CreateRoleDto, CreateRoleWithPermissionsDto, RoleDto, RoleWithPermissionsDto, UpdateRoleDto, UpdateRoleWithPermissionsDto } from "../dtos/role";
import { CustomError } from "../helpers";
import { RoleMapper } from "../mappers/role.mapper";

export class RoleService {


    public async getRolesWithPermissions() {
        // TODO: Mapping
        const dbRoles = await dbClient.role.findMany({
            where: { isDeleted: false },
            include: {
                permissions: {
                    select: {
                        permission: true
                    }
                }
            }
        })
        console.log(dbRoles)
        const result = dbRoles.map(role => RoleWithPermissionsDto.mapFrom(role));
        return result;
    }

    public async createRoleWithPermissions(createRoleWithPermissionsDto: CreateRoleWithPermissionsDto, currentUser: CurrentUserDto) {
        const { permissionIds } = createRoleWithPermissionsDto;
        const permissions = await dbClient.permission.findMany({
            where: {
                isDeleted: false,
                id: { in: permissionIds }
            }
        })
        console.log({ permissions })
        if (permissionIds.length && (permissions.length !== permissionIds.length)) {
            throw CustomError.badRequest(`At least one of the permission IDs specified does not exists`);
        }
        const roleToCreate = RoleMapper.from(createRoleWithPermissionsDto);
        roleToCreate.changedBy = currentUser.userName;

        const newRole = await dbClient.role.create({
            data: {
                ...roleToCreate,
                permissions: {
                    create: permissionIds.map(id => (
                        {
                            changedBy: currentUser.userName,
                            permission: {
                                connect: { id }
                            }
                        }
                    ))
                }
            }
        })

        return RoleDto.mapFrom({ ...newRole, permissions });

    }

    public async updateRoleWithPermissions(updateRoleWithPermissionDto: UpdateRoleWithPermissionsDto, currentUser: CurrentUserDto) {
        const { id, permissionIds } = updateRoleWithPermissionDto;

        const roleDb = await dbClient.role.findFirst({ where: { id, isDeleted: false } })
        if (!roleDb) throw CustomError.notFound(`No role found with ID: ${id}`)
        const permissions = await dbClient.permission.findMany({
            where: {
                isDeleted: false,
                id: { in: permissionIds }
            }
        })
        if (permissionIds.length && (permissions.length !== permissionIds.length)) {
            throw CustomError.badRequest(`At least one of the permission IDs specified does not exists`);
        }

        const roleToUpdate = RoleMapper.from(updateRoleWithPermissionDto);
        roleToUpdate.changedBy = currentUser.userName;
        roleToUpdate.changeType = 'U';

        const roleDbUpdated = await dbClient.role.update({
            where: { id },
            data: {
                ...roleToUpdate,
                permissions: {
                    deleteMany: {},
                    create: permissionIds.map(id => (
                        {
                            changedBy: currentUser.userName,
                            permission: {
                                connect: { id }
                            }
                        }
                    ))
                }
            }
        })
        const result = RoleDto.mapFrom({ ...roleDbUpdated, permissions });
        return result;

    }


    public async getRoles() {
        const dbRoles = await dbClient.role.findMany({ where: { isDeleted: false } });
        return dbRoles.map(role => RoleDto.mapFrom(role));
    }

    public async createRole(createRoleDto: CreateRoleDto, currentUser: CurrentUserDto) {
        const roleToCreate = RoleMapper.from(createRoleDto);
        roleToCreate.changedBy = currentUser.userName;
        const dbRoleCreated = await dbClient.role.create({
            data: roleToCreate
        })
        return RoleDto.mapFrom(dbRoleCreated);
    }

    public async updateRole(updateRoleDto: UpdateRoleDto, currentUser: CurrentUserDto) {
        const roleDb = await dbClient.role.findFirst({ where: { id: updateRoleDto.id, isDeleted: false } })
        if (!roleDb) throw CustomError.notFound(`No role found with ID: ${updateRoleDto.id}`)

        const roleToUpdate = RoleMapper.from(updateRoleDto);
        roleToUpdate.changedBy = currentUser.userName;
        roleToUpdate.changeType = "U";

        const dbRoleUpdated = await dbClient.role.update({
            where: {
                id: updateRoleDto.id
            },
            data: roleToUpdate
        })
        return RoleDto.mapFrom(dbRoleUpdated);
    }

    public async deleteRole(id: number, currentUser: CurrentUserDto) {
        const roleDb = await dbClient.role.findFirst({ where: { id, isDeleted: false } })
        if (!roleDb) throw CustomError.notFound(`No role found with ID: ${id}`)
        const dbRoleDeleted = await dbClient.role.update({
            where: { id },
            data: { isDeleted: true, changedBy: currentUser.userName, changeType: 'D' }
        })
        return dbRoleDeleted ? true : false;
    }

    public async getManyRolesByIds(roleIds: number[]) {
        if (roleIds.length === 0) {
            return [];
        }
        const roles = await dbClient.role.findMany({
            where: { id: { in: roleIds } }
        })
        return roles;
    }

}