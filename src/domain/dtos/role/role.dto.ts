import { PermissionDto } from "../permission";

export class RoleDto {
    private constructor(
        public id: number,
        public name: string,
        public createdAt: Date,
        public permissions?: RoleDto[]
    ) {

    }

    public static mapFrom(obj: { [key: string]: any }): RoleDto {
        const { id, name, createdAt, permissions } = obj
        let permissionsDto
        if (permissions) {
            permissionsDto = permissions.map((permission: any) => PermissionDto.mapFrom(permission))
        }
        return new RoleDto(id, name, createdAt, permissionsDto);
    }
}