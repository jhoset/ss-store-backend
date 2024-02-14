import { RoleDto } from "../role";


export class UserRolesDto {


    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public verifiedEmail: boolean,
        public roles: RoleDto[]
    ) { }

    public static mapFrom(obj: { [key: string]: any }): UserRolesDto {
        const { id, firstName, middleName, lastName, userName, email, verifiedEmail, roles } = obj;
        const rolesDto = roles.map((role: Object) => RoleDto.mapFrom(role));
        return new UserRolesDto(id, firstName, middleName, lastName, userName, email, verifiedEmail, rolesDto)
    }

}