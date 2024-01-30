export interface DtoValidationError {
    error: string,
    validationErrors: string[]
}

export class PaginationDto {

    private constructor(
        public readonly page: number,
        public readonly limit: number
    ) { }

    public static mapFrom(page: number = 1, limit: number = 10): [DtoValidationError?, PaginationDto?] {
        let validationErrors = [];
        if (isNaN(page) || isNaN(limit)) {
            validationErrors.push("Page and Limit must be numbers.");
        } else {
            if (page <= 0) validationErrors.push("Page must be greater than 0.");
            if (limit <= 0) validationErrors.push("Limit must be greater than 0.")
        }

        if (validationErrors.length) {
            return [{ error: "Invalid fields in Pagination DTO.", validationErrors }, undefined];
        }
        return [undefined, new PaginationDto(page, limit)]


    }


}