import { RegularExps, ValidationError } from "../../helpers";
import { BaseDto } from "../base.dto";

export class CreateUserDto extends BaseDto {


    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public verifiedEmail: boolean,
        public password: string,
    ) {
        super();
    }

    public static mapFrom(obj: { [key: string]: any }): [ValidationError?, CreateUserDto?] {
        const {id, firstName, middleName, lastName, userName, email, verifiedEmail, password } = obj;
        let validationErrors = [];
        if (!firstName) validationErrors.push("First Name is required.");
        if (!lastName) validationErrors.push("Last Name is required.");
        if (!email) validationErrors.push("Email is required");
        if (email && !RegularExps.email.test(email)) validationErrors.push("Email is not valid");
        if (!password) validationErrors.push("Password is required.");
        if (password && password.length < 6) validationErrors.push("Password is too short.");

        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        return [undefined, new CreateUserDto(id,firstName, middleName, lastName, userName, email, verifiedEmail, password)]
    }

}