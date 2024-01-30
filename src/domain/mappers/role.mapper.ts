import { Role } from "@prisma/client";

export class RoleMapper {
    public static from = (obj: { [key: string]: any }): Role => {
        const {
            id,
            name,
            isDeleted,
            createdAt,
            updatedAt,
            changedBy,
            changeType,
        } = obj;
        return { id, name, isDeleted, createdAt, updatedAt, changedBy, changeType };
    }
}