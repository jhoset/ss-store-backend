import { dbClient } from "../../data";
import { CurrentUserDto } from "../dtos/auth";
import { CreateRoleDto, RoleDto, UpdateRoleDto } from "../dtos/role";
import { PaginationResultDto } from "../dtos/shared/pagination-result.dto";
import { PaginationDto } from "../dtos/shared/pagination.dto";
import { CustomError } from "../helpers";
import { RoleMapper } from "../mappers/role.mapper";

export class RoleService {


    public async getRoles() {
        const dbRoles = await dbClient.role.findMany({ where: { isDeleted: false } });
        return dbRoles.map(role => RoleDto.mapFrom(role));
    }

    public async createRole(roleDto: CreateRoleDto, currentUser: CurrentUserDto) {
        const roleToCreate = RoleMapper.from(roleDto);
        roleToCreate.changedBy = currentUser.userName;
        const dbRoleCreated = await dbClient.role.create({
            data: roleToCreate
        })
        return RoleDto.mapFrom(dbRoleCreated);
    }

    public async updateRole(id: number, roleDto: UpdateRoleDto, currentUser: CurrentUserDto) {
        const roleDb = await dbClient.role.findFirst({ where: { id, isDeleted: false } })
        if (!roleDb) throw CustomError.notFound(`No role found with ID: ${id}`)

        const roleToUpdate = RoleMapper.from(roleDto);
        roleToUpdate.changedBy = currentUser.userName;
        roleToUpdate.changeType = "U";

        const dbRoleUpdated = await dbClient.role.update({
            where: {
                id
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