import { RegularExps, ValidationDtoError, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class UpdateUserDto extends BaseDto {


    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, UpdateUserDto?] {
        const { id, firstName, middleName, lastName, userName, email } = obj;
        let validationErrors: ValidationError[] = [];
        if (!id || isNaN(+id) || id < 1) validationErrors.push({ field: "id", errorMessage: "User ID is invalid" });
        if (!firstName) validationErrors.push({ field: "firstName", errorMessage: "First Name is required" });
        if (!lastName) validationErrors.push({ field: "lastName", errorMessage: "Last Name is required" });
        if (!email) validationErrors.push({ field: "email", errorMessage: "Email is required" });
        if (email && !RegularExps.email.test(email)) validationErrors.push({ field: "email", errorMessage: "Email is not valid" })

        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined];
        }
        return [undefined, new UpdateUserDto(id, firstName, middleName, lastName, userName, email)]
    }

}