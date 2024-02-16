import { ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";



export class UpdateRoleWithPermissionsDto extends BaseDto {

    private constructor(
        public id: number,
        public name: string,
        public permissionIds: number[]
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, UpdateRoleWithPermissionsDto?] {

        const { id, name, permissionIds } = obj;
        let validationErrors: ValidationError[] = []
        if (!id || isNaN(+id) || id < 1) validationErrors.push({ field: "id", errorMessage: "Role ID is invalid" });
        if (!name || name.trim() === '') validationErrors.push({ field: "name", errorMessage: "Role Name is required" })
        if (!permissionIds) validationErrors.push({ field: "permissionIds", errorMessage: "Permission IDs is required" });
        if (permissionIds && !Array.isArray(permissionIds)) validationErrors.push({ field: "permissionIds", errorMessage: "Permission IDs is not a List" });
        permissionIds?.length && permissionIds.forEach((id: any) => {
            if (!id || isNaN(+id)) validationErrors.push({ field: "permissionIds", errorMessage: "Permission IDs contain one or more invalid ID" });
        })

        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined]
        }
        return [undefined, new UpdateRoleWithPermissionsDto(id, name, permissionIds)];
    }
}

