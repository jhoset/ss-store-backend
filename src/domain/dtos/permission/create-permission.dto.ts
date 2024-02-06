import { ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class CreatePermissionDto extends BaseDto {

    private constructor(
        public name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationError?, CreatePermissionDto?] {
        const { name } = obj
        const validationErrors = [];
        if (!name || name.trim() === '') validationErrors.push("Permission Name is required");
        if (validationErrors.length) {
            return [{ error: 'Invalid Fields', validationErrors }, undefined];
        }
        return [undefined, new CreatePermissionDto(name)];
    }


}