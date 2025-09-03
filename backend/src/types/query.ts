export interface QueryParams {
  // Pagination
  page?: number;
  limit?: number;
  offset?: number;
  
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  
  // Filtering
  filters?: Record<string, any>;
  
  // Search
  search?: string;
  searchFields?: string[];
  
  // Relations
  include?: string[];
}

export interface QueryResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {
    sortBy?: string;
    sortOrder?: string;
    filters?: Record<string, any>;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SearchOptions {
  search: string;
  searchFields: string[];
}