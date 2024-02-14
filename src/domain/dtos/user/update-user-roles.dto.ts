import { ValidationError } from "../../helpers";


export class UpdateUserRolesDto {
    private constructor(
        public userId: number,
        public roleIds: number[]
    ) { }

    public static mapFrom(obj: { [key: string]: any }): [ValidationError?, UpdateUserRolesDto?] {
        const { userId, roleIds } = obj;
        let validationErrors = [];
        if (!userId || isNaN(+userId) || userId <= 0) validationErrors.push("userId has invalid value");
        if (!roleIds) validationErrors.push("roleIds is required");
        roleIds && roleIds.forEach((id: any) => {
            if (!id || isNaN(+id)) validationErrors.push("One of the Roles ID is not valid");
            return;
        });
        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        return [undefined, new UpdateUserRolesDto(userId, roleIds)];
    }
}
