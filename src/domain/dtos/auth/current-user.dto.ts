export class CurrentUserDto {
    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public verifiedEmail: boolean,
    ) {}

    public static mapFrom(obj: { [key: string]: any }): CurrentUserDto {
        const {id, firstName, middleName, lastName, userName, email, verifiedEmail } = obj;
        return new CurrentUserDto(id,firstName, middleName, lastName, userName, email, verifiedEmail)
    }
}