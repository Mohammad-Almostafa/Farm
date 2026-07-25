// Models/paginatedResult.ts
export interface PaginatedResult<T> {
  items: T[];
  metaData: PaginationMetaData;
}

export interface PaginationMetaData {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
