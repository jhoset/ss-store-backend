import { RegularExps, ValidationDtoError, ValidationError } from "../../helpers";
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

    public static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, CreateUserDto?] {
        const { id, firstName, middleName, lastName, userName, email, verifiedEmail, password } = obj;
        let validationErrors: ValidationError[] = [];
        if (!firstName) validationErrors.push({ field: "firstName", errorMessage: "First Name is required" });
        if (!lastName) validationErrors.push({ field: "lastName", errorMessage: "Last Name is required" });
        if (!email) validationErrors.push({ field: "email", errorMessage: "Email is required" });
        if (email && !RegularExps.email.test(email)) validationErrors.push({ field: "email", errorMessage: "Email is not valid" });
        if (!password) validationErrors.push({ field: "password", errorMessage: "Password is required" });
        if (password && password.length < 6) validationErrors.push({ field: "password", errorMessage: "Password is too short" });

        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined];
        }
        return [undefined, new CreateUserDto(id, firstName, middleName, lastName, userName, email, verifiedEmail, password)]
    }

}