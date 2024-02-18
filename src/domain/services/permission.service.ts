import { dbClient } from "../../data";
import { CurrentUserDto } from "../dtos/auth";
import { CreatePermissionDto, PermissionDto, UpdatePermissionDto } from "../dtos/permission";
import { CustomError } from "../helpers";
import { PermissionMapper } from "../mappers";


export class PermissionService {

    public async getPermissions() {
        const dbPermissions = await dbClient.permission.findMany({ where: { isDeleted: false } });
        return dbPermissions.map(permission => PermissionDto.mapFrom(permission));
    }

    public async createPermission(createPermissionDto: CreatePermissionDto, currentUser: CurrentUserDto) {
        const permissionToCreate = PermissionMapper.from(createPermissionDto);
        permissionToCreate.changedBy = currentUser.userName;
        const dbPermissionCreated = await dbClient.permission.create({
            data: permissionToCreate,
        })
        return PermissionDto.mapFrom(dbPermissionCreated);
    }

    public async updatePermission(updatePermissionDto: UpdatePermissionDto, currentUser: CurrentUserDto) {
        const permissionDb = await dbClient.permission.findFirst({ where: { id: updatePermissionDto.id, isDeleted: false } });
        if (!permissionDb) throw CustomError.notFound(`No permission found with ID: ${updatePermissionDto.id}`);

        const permissionToUpdate = PermissionMapper.from(updatePermissionDto);
        permissionToUpdate.changedBy = currentUser.userName;
        permissionToUpdate.changeType = 'U';

        const dbPermissionUpdated = await dbClient.permission.update({
            where: {
                id: updatePermissionDto.id
            },
            data: permissionToUpdate
        })
        return PermissionDto.mapFrom(dbPermissionUpdated);
    }

    public async deletePermission(id: number, currentUser: CurrentUserDto) {
        const permissionDb = await dbClient.permission.findFirst({ where: { id, isDeleted: false } });
        if (!permissionDb) throw CustomError.notFound(`No permission found with ID: ${id}`);
        const dbPermissionDeleted = await dbClient.permission.update({
            where: { id },
            data: { isDeleted: true, changedBy: currentUser.userName, changeType: 'D' }
        })
        return dbPermissionDeleted ? true: false;
    }


}