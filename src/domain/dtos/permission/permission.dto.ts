export class PermissionDto {

    private constructor( 
        public id: number,
        public name: string,
        public createdAt: Date ) {
    }

    public static mapFrom(obj: { [key: string]: any }): PermissionDto {
        const { id, name, createdAt } = obj;
        return new PermissionDto(id, name, createdAt);
    }
}