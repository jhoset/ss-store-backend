import { BaseDto } from "../base.dto";

export class UserDto {


    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public verifiedEmail: boolean,
    ) {}

    public static mapFrom(obj: { [key: string]: any }): UserDto {
        const {id, firstName, middleName, lastName, userName, email, verifiedEmail } = obj;
        return new UserDto(id,firstName, middleName, lastName, userName, email, verifiedEmail)
    }

}