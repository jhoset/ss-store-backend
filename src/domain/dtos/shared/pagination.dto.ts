import { ValidationDtoError, ValidationError } from "../../helpers";

export class PaginationDto {

    private constructor(
        public readonly page: number,
        public readonly limit: number
    ) { }

    public static mapFrom(page: number = 1, limit: number = 10): [ValidationDtoError?, PaginationDto?] {
        let validationErrors: ValidationError[] = [];
        if (isNaN(page)) validationErrors.push({ field: "page", errorMessage: "Page must be numbers" });
        if (isNaN(limit)) validationErrors.push({ field: "limit", errorMessage: "Page must be numbers" });
        if (!isNaN(page) && page <= 0) validationErrors.push({ field: "page", errorMessage: "Page must be greater than 0" });
        if (!isNaN(limit) && limit <= 0) validationErrors.push({ field: "limit", errorMessage: "Limit must be greater than 0" })

        if (validationErrors.length) {
            return [{ error: "Invalid DTO", validationErrors }, undefined];
        }
        return [undefined, new PaginationDto(page, limit)]


    }


}