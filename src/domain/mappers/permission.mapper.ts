import { Permission } from "@prisma/client";

export class PermissionMapper {
    public static from = (obj: { [key: string]: any }): Permission => {
        const {
            id,
            name,
            isDeleted,
            createdAt,
            updatedAt,
            changedBy,
            changeType,

        } = obj;
        return { id, name, isDeleted, createdAt, updatedAt, changedBy, changeType }
    }
}