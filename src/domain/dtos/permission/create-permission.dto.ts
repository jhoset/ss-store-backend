import { ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class CreatePermissionDto extends BaseDto {

    private constructor(
        public name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, CreatePermissionDto?] {
        const { name } = obj
        const validationErrors: ValidationError[] = [];
        if (!name || name.trim() === '') validationErrors.push({ field: "name", errorMessage: "Permission Name is required" });
        if (validationErrors.length) {
            return [{ error: 'Invalid DTO', validationErrors }, undefined];
        }
        return [undefined, new CreatePermissionDto(name)];
    }


}