import { User } from "@prisma/client";
import { CustomError } from "../helpers";

export class UserMapper {

    public static from = (obj: { [key: string]: any }): User => {
        try {
            const {
                id,
                firstName,
                middleName,
                userName,
                lastName,
                email,
                verifiedEmail,
                password,
                isDeleted,
                createdAt,
                updatedAt,
                changedBy,
                changeType
            } = obj;
            return {
                id, firstName, middleName, lastName, email, userName, verifiedEmail, password, isDeleted, createdAt, updatedAt, changedBy, changeType
            }
        } catch (error) {
            throw CustomError.internalServerError("Error mapping object to UserEntity", `${error}`);
        }
    }
}