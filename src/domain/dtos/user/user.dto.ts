import { RoleDto } from "../role";

export class UserDto {


    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public verifiedEmail: boolean,
        public roles?: RoleDto[]
    ) { }

    public static mapFrom(obj: { [key: string]: any }): UserDto {
        const { id, firstName, middleName, lastName, userName, email, verifiedEmail, roles } = obj;
        let rolesDto
        if (roles) {
            rolesDto = roles.map((role: any) => RoleDto.mapFrom(role))
        }
        return new UserDto(id, firstName, middleName, lastName, userName, email, verifiedEmail, rolesDto)
    }

}