import { RegularExps, ValidationError } from "../../helpers";

export class LoginUserDto {


    private constructor(
        public email: string,
        public password: string) {
    }

    static mapFrom(obj: { [key: string]: any }): [ValidationError?, LoginUserDto?] {
        const { email, password } = obj;
        const validationErrors = [];
        if (!email) validationErrors.push("Email is required");
        if (email && !RegularExps.email.test(email)) validationErrors.push("Email is not valid");
        if (!password) validationErrors.push("Password is required.");
        if (password && password.length < 6) validationErrors.push("Password is too short.");
        if (validationErrors.length) {
            return [{ error: "Invalid Fields", validationErrors }, undefined];
        }
        return [undefined, new LoginUserDto(email, password)];

    }


}