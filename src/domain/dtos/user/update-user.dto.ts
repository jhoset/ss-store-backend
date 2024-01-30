import { RegularExps, ValidationError } from "../../helpers";
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

    public static mapFrom(obj: { [key: string]: any }): [ValidationError?, UpdateUserDto?] {
        const { id, firstName, middleName, lastName, userName, email } = obj;
        let validationErrors = [];
        if (!firstName) validationErrors.push("First Name is required.");
        if (!lastName) validationErrors.push("Last Name is required.");
        if (!email) validationErrors.push("Email is required.");
        if (email && !RegularExps.email.test(email)) validationErrors.push("Email is not valid.")

        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        return [undefined, new UpdateUserDto(id, firstName, middleName, lastName, userName, email)]
    }   

}