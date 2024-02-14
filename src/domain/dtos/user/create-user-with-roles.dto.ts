import { RegularExps, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";
import { RoleDto } from "../role";

export class CreateUserWithRoleDto extends BaseDto {


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

    public static mapFrom(obj: { [key: string]: any }): [ValidationError?, CreateUserWithRoleDto?] {
        const { id, firstName, middleName, lastName, userName, email, verifiedEmail, password, roles: roleIds } = obj;
        let validationErrors = [];
        if (!firstName) validationErrors.push("First Name is required.");
        if (!lastName) validationErrors.push("Last Name is required.");
        if (!email) validationErrors.push("Email is required");
        if (email && !RegularExps.email.test(email)) validationErrors.push("Email is not valid");
        if (!password) validationErrors.push("Password is required.");
        if (password && password.length < 6) validationErrors.push("Password is too short.");
        if (!roleIds || !roleIds.length) validationErrors.push("Role Ids is required, at least one existing role ID");
        roleIds && roleIds.forEach((id: any) => {
            if (!id || isNaN(+id)) validationErrors.push("One of the Roles ID is not valid");
            return;
        });

        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        return [undefined, new CreateUserWithRoleDto(id, firstName, middleName, lastName, userName, email, verifiedEmail, password, roleIds)]
    }

}