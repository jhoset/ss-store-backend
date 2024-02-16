import { ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";


export class CreateRoleDto extends BaseDto {

    private constructor(
        public name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, CreateRoleDto?] {
        const { name } = obj;
        const validationErrors: ValidationError[] = [];
        if (!name || name.trim() === '') validationErrors.push({ field: "name", errorMessage: "Role Name is required" })
        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        return [undefined, new CreateRoleDto(name)];
    }
}