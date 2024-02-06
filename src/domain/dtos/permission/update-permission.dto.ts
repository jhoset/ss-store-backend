import { ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class UpdatePermissionDto extends BaseDto {
    private constructor(
        private name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationError?, UpdatePermissionDto?] {
        const { name } = obj;
        const validationErrors = [];
        if (!name || name.trim() === '') validationErrors.push("Role Name is required");
        if (validationErrors.length) {
            return [{ error: 'Invalid Fields', validationErrors }, undefined];
        }
        return [undefined, new UpdatePermissionDto(name)];
    }
    
}