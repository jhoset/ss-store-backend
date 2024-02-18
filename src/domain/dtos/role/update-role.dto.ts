import { ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";


export class UpdateRoleDto extends BaseDto {

    private constructor(
        public id: number,
        public name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, UpdateRoleDto?] {
        const { id, name } = obj;
        const validationErrors: ValidationError[] = [];
        if (!id || isNaN(+id) || id < 1) validationErrors.push({ field: "id", errorMessage: "Role ID is invalid" });
        if (!name || name.trim() === '') validationErrors.push({ field: "name", errorMessage: "Role Name is required" })
        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        return [undefined, new UpdateRoleDto(id, name)];
    }

}