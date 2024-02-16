import { RegularExps, ValidationDtoError, ValidationError } from "../../helpers";

export class LoginUserDto {


    private constructor(
        public email: string,
        public password: string) {
    }

    static mapFrom(obj: { [key: string]: any }): [ValidationDtoError?, LoginUserDto?] {
        const { email, password } = obj;
        const validationErrors: ValidationError[] = [];
        if (!email) validationErrors.push({ field: "email", errorMessage: "Email is required" });
        if (email && !RegularExps.email.test(email)) validationErrors.push({ field: "email", errorMessage: "Email is not valid" });
        if (!password) validationErrors.push({ field: "password", errorMessage: "Password is required" });
        if (password && password.length < 6) validationErrors.push({ field: "password", errorMessage: "Password is too short" });
        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined];
        }
        return [undefined, new LoginUserDto(email, password)];

    }


}