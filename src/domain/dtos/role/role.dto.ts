export class RoleDto {
    private constructor(
        public id: number,
        public name: string,
        public createdAt: Date,
    ) {

    }

    public static mapFrom(obj: { [key: string]: any }): RoleDto {
        const {id, name, createdAt} = obj
        return new RoleDto(id, name, createdAt);
    }
}