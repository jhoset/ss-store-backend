import { ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class UpdatePermissionDto extends BaseDto {
    private constructor(
        private name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, UpdatePermissionDto?] {
        const { name } = obj;
        const validationErrors: ValidationError[] = [];
        if (!name || name.trim() === '') validationErrors.push({ field: "name", errorMessage: "Role Name is required" });
        if (validationErrors.length) {
            return [{ error: 'Invalid DTO', validationErrors }, undefined];
        }
        return [undefined, new UpdatePermissionDto(name)];
    }

}