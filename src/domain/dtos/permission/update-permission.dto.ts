import { ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class UpdatePermissionDto extends BaseDto {
    private constructor(
        public id: number,
        public name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, UpdatePermissionDto?] {
        const { id, name } = obj;
        const validationErrors: ValidationError[] = [];
        if (!id || isNaN(+id) || id < 1) validationErrors.push({ field: "id", errorMessage: "Permission ID is invalid" });
        if (!name || name.trim() === '') validationErrors.push({ field: "name", errorMessage: "Permission Name is required" });
        if (validationErrors.length) {
            return [{ error: 'Invalid DTO', validationErrors }, undefined];
        }
        return [undefined, new UpdatePermissionDto(id, name)];
    }

}