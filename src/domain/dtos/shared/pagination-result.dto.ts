export interface PaginationResultDto {
    pagination: {
        total: number,
        page: number,
        limit: number,
        next: string | null,
        prev: string | null
    }
    result: any[]
}