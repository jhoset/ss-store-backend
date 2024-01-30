import { dbClient } from "../../data";
import { PaginationResultDto } from "../dtos/shared/pagination-result.dto";
import { PaginationDto } from "../dtos/shared/pagination.dto";
import { CustomError } from "../helpers";

export class RoleService {


    public async getRoles() {
        const dbRoles = await dbClient.role.findMany({ where: { isDeleted: false } });
        return dbRoles;
    }

    public async createRole(roleDto: any) {
        const dbRoleCreated = await dbClient.role.create({
            data: roleDto
        })
        return dbRoleCreated;
    }

    public async updateRole(roleDto: any) {
        const roleDb = await dbClient.role.findFirst({ where: { id: roleDto.id } })
        if (!roleDb) throw CustomError.notFound(`No role found with ID: ${roleDto.id}`)
        const dbRoleUpdated = await dbClient.role.update({
            where: {
                id: roleDto.id
            },
            data: {
                ...roleDto
            }
        })
        return dbRoleUpdated;
    }

    public async deleteRole(id: number) {
        const roleDb = await dbClient.role.findFirst({ where: { id } })
        if (!roleDb) throw CustomError.notFound(`No role found with ID: ${id}`)
        const dbRoleDeleted = await dbClient.role.delete({
            where: {
                id
            }
        })
        return dbRoleDeleted ? true : false;
    }

}