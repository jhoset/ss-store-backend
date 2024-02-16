import { RegularExps, ValidationDtoError, ValidationError } from "../../helpers";


export class UpdateUserWithRolesDto {
    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public roleIds: number[]
    ) { }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, UpdateUserWithRolesDto?] {
        const { id, firstName, middleName, lastName, userName, email, roleIds } = obj;
        let validationErrors: ValidationError[] = [];
        if (!id || isNaN(+id) || id < 1) validationErrors.push({ field: "id", errorMessage: "User ID is invalid" });
        if (!firstName) validationErrors.push({ field: "firstName", errorMessage: "First Name is required" });
        if (!lastName) validationErrors.push({ field: "lastName", errorMessage: "Last Name is required" });
        if (!email) validationErrors.push({ field: "email", errorMessage: "Email is required" });
        if (email && !RegularExps.email.test(email)) validationErrors.push({ field: "email", errorMessage: "Email is not valid" })
        if (!roleIds) validationErrors.push({ field: "roleIds", errorMessage: "roleIds is required" });
        if (roleIds && !Array.isArray(roleIds)) validationErrors.push({ field: "roleIds", errorMessage: "Role IDs is not a List" });
        roleIds?.length && roleIds.forEach((id: any) => {
            if (!id || isNaN(+id) || id < 1) validationErrors.push({ field: "roleIds", errorMessage: "Role IDs contain one or more invalid ID" });
            return;
        });
        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined];
        }
        return [undefined, new UpdateUserWithRolesDto(id, firstName, middleName, lastName, userName, email, roleIds)];
    }
}
