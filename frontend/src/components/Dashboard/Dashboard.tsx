import { SimpleReslinksTable } from './SimpleReslinksTable';
import { ReslinkFilters } from './ReslinkFilters';
import { Pagination } from './Pagination';
import { useReslinks } from '../../hooks/useReslinks';
import type { Reslink } from '../../types/reslink';
import { AppLayout } from '../Layout/AppLayout';

export const Dashboard = () => {

  // Use the new query hook for reslinks
  const {
    data: reslinks,
    loading,
    error,
    pagination,
    params,
    search,
    sort,
    filter,
    clearSearch,
    clearFilters,
    goToPage,
    addReslink,
    refresh,
    changeItemsPerPage
  } = useReslinks();

  const handleDelete = (id: number) => {
    // Refresh the reslinks after deletion
    refresh();
  };

  console.log('🏠 Dashboard received from hook:', { reslinks, reslinksLength: reslinks?.length, loading, error });






  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">My Reslinks</h1>
            <p className="text-muted-foreground">Manage your professional video introductions</p>
          </div>

          <div className="space-y-6">
            {/* Filters and Search */}
            <ReslinkFilters
              onSearch={search}
              onFilter={filter}
              onSort={sort}
              onClearSearch={clearSearch}
              onClearFilters={clearFilters}
              currentSearch={params.search || ''}
              currentFilters={params.filters || {}}
              currentSort={{
                sortBy: params.sortBy || 'created_date',
                sortOrder: params.sortOrder || 'desc'
              }}
            />

            {/* Results Table */}
            <SimpleReslinksTable data={reslinks} loading={loading} error={error} onDelete={handleDelete} />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={goToPage}
                onItemsPerPageChange={changeItemsPerPage}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};