import { ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";


export class CreateRoleWithPermissionsDto extends BaseDto {

    private constructor(
        public name: string,
        public permissionIds: number[]
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, CreateRoleWithPermissionsDto?] {

        const { name, permissionIds } = obj;
        let validationErrors: ValidationError[] = []
        if (!name) validationErrors.push({ field: "name", errorMessage: "Role Name is required" });
        if (!permissionIds || !permissionIds.length) validationErrors.push({ field: "permissionIds", errorMessage: "Permission IDs is required, , at least one existing permission ID" });
        permissionIds?.length && permissionIds.forEach((id: any) => {
            if (!id || isNaN(+id)) validationErrors.push({ field: "permissionIds", errorMessage: "Permission IDs contain one or more invalid ID" });
        })

        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined]
        }
        return [undefined, new CreateRoleWithPermissionsDto(name, permissionIds)];
    }


}