import { RegularExps, ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class CreateUserWithRolesDto extends BaseDto {


    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public verifiedEmail: boolean,
        public password: string,
        public roleIds: number[]
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, CreateUserWithRolesDto?] {
        const { id, firstName, middleName, lastName, userName, email, verifiedEmail, password, roles: roleIds } = obj;
        let validationErrors: ValidationError[] = [];
        if (!firstName) validationErrors.push({ field: "firstName", errorMessage: "First Name is required" });
        if (!lastName) validationErrors.push({ field: "lastName", errorMessage: "Last Name is required" });
        if (!email) validationErrors.push({ field: "email", errorMessage: "Email is required" });
        if (email && !RegularExps.email.test(email)) validationErrors.push({ field: "email", errorMessage: "Email is not valid" });
        if (!password) validationErrors.push({ field: "password", errorMessage: "Password is required" });
        if (password && password.length < 6) validationErrors.push({ field: "password", errorMessage: "Password is too short" });
        if (!roleIds || !roleIds.length) validationErrors.push({ field: "roleIds", errorMessage: "Role IDs is required, at least one existing role ID" });
        roleIds.length && roleIds.forEach((id: any) => {
            if (!id || isNaN(+id)) validationErrors.push({ field: "roleIds", errorMessage: "Role IDs contain one or more invalid ID" });
            return;
        });

        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined];
        }
        return [undefined, new CreateUserWithRolesDto(id, firstName, middleName, lastName, userName, email, verifiedEmail, password, roleIds)]
    }

}