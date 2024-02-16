export interface ValidationError {
    field: string,
    errorMessage: string
}

export interface ValidationDtoError {
    error: string,
    validationErrors: ValidationError[]
}