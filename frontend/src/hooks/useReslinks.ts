import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Reslink } from '../types/reslink';

interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const useReslinks = (initialParams: QueryParams = {}) => {
  const [data, setData] = useState<Reslink[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'created_date',
    sortOrder: 'desc',
    ...initialParams
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching reslinks with params:', params);
      const result = await apiService.getReslinks(params);
      console.log('📊 API result:', result);
      console.log('📊 API result.data:', result.data);
      console.log('📊 API result structure keys:', Object.keys(result));
      
      // Handle both array and object responses
      if (Array.isArray(result)) {
        console.log('📊 API returned array directly, using it');
        setData(result);
        setPagination(null); // No pagination info available
      } else {
        console.log('📊 API returned object, using result.data');
        setData(result.data || []);
        setPagination(result.pagination);
      }
    } catch (err) {
      console.error('Error fetching reslinks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData([]); // Ensure data is always an array on error
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = (newParams: Partial<QueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const changeItemsPerPage = (limit: number) => {
    updateParams({ limit, page: 1 });
  };

  const nextPage = () => {
    if (pagination?.hasNext) {
      updateParams({ page: pagination.page + 1 });
    }
  };

  const prevPage = () => {
    if (pagination?.hasPrev) {
      updateParams({ page: pagination.page - 1 });
    }
  };

  const goToPage = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      updateParams({ page });
    }
  };

  const search = (searchTerm: string) => {
    updateParams({ search: searchTerm, page: 1 });
  };

  const sort = (sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    updateParams({ sortBy, sortOrder, page: 1 });
  };

  const filter = (filters: Record<string, any>) => {
    updateParams({ filters, page: 1 });
  };

  const clearSearch = () => {
    updateParams({ search: '', page: 1 });
  };

  const clearFilters = () => {
    updateParams({ filters: {}, page: 1 });
  };

  const reset = () => {
    setParams({
      page: 1,
      limit: 10,
      sortBy: 'created_date',
      sortOrder: 'desc',
    });
  };

  // Add a new reslink to the local state (for optimistic updates)
  const addReslink = (reslink: Reslink) => {
    setData(prev => prev ? [reslink, ...prev] : [reslink]);
    if (pagination) {
      setPagination(prev => prev ? { ...prev, total: prev.total + 1 } : null);
    }
  };

  // Update a reslink in the local state
  const updateReslink = (id: number, updates: Partial<Reslink>) => {
    setData(prev => prev ? prev.map(reslink => 
      reslink.id === id ? { ...reslink, ...updates } : reslink
    ) : []);
  };

  // Remove a reslink from the local state
  const removeReslink = (id: number) => {
    setData(prev => prev ? prev.filter(reslink => reslink.id !== id) : []);
    if (pagination) {
      setPagination(prev => prev ? { ...prev, total: prev.total - 1 } : null);
    }
  };

  return {
    // Data
    data,
    pagination,
    loading,
    error,
    params,
    
    // Actions
    nextPage,
    prevPage,
    goToPage,
    search,
    sort,
    filter,
    clearSearch,
    clearFilters,
    reset,
    refresh: fetchData,
    changeItemsPerPage,
    
    // Local state management
    addReslink,
    updateReslink,
    removeReslink,
    
    // Computed values
    totalPages: pagination?.totalPages || 0,
    currentPage: pagination?.page || 1,
    totalItems: pagination?.total || 0,
    hasData: data?.length > 0,
    isEmpty: !loading && (data?.length === 0 || !data),
  };
};