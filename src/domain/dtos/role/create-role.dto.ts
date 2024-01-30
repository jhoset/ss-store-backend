import { SystemChgType } from "../../../config/constants";
import { ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";


export class CreateRoleDto extends BaseDto {

    private constructor(
        public name: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationError?, CreateRoleDto?] {
        const { name, userName } = obj;
        const validationErrors = [];
        if (!name || name.trim() === '') validationErrors.push("Role Name is required.")
        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        const createRoleDto = new CreateRoleDto(name);
        createRoleDto.initMetaData(userName, SystemChgType.create);
        return [undefined, createRoleDto];
    }
}