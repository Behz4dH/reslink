import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';

interface ReslinkFiltersProps {
  onSearch: (search: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onClearSearch: () => void;
  onClearFilters: () => void;
  currentSearch?: string;
  currentFilters?: Record<string, any>;
  currentSort?: { sortBy: string; sortOrder: 'asc' | 'desc' };
}

export const ReslinkFilters = ({
  onSearch,
  onFilter,
  onSort,
  onClearSearch,
  onClearFilters,
  currentSearch = '',
  currentFilters = {},
  currentSort = { sortBy: 'created_date', sortOrder: 'desc' }
}: ReslinkFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [statusFilter, setStatusFilter] = useState(currentFilters.status || 'all');
  const [companyFilter, setCompanyFilter] = useState(currentFilters.company || '');
  const [positionFilter, setPositionFilter] = useState(currentFilters.position || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...currentFilters };
    
    // Handle "all" value as clearing the filter
    if (value === 'all' || value === '' || value === undefined) {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = value;
    }
    
    // Remove undefined values
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] === undefined || newFilters[key] === '' || newFilters[key] === 'all') {
        delete newFilters[key];
      }
    });
    
    onFilter(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newOrder = currentSort.sortBy === sortBy && currentSort.sortOrder === 'desc' ? 'asc' : 'desc';
    onSort(sortBy, newOrder);
  };

  const activeFiltersCount = Object.keys(currentFilters).length;
  const hasActiveSearch = currentSearch.length > 0;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, position, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
        {hasActiveSearch && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              onClearSearch();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              handleFilterChange('status', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="multiple_views">Multiple Views</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-filter">Company</Label>
          <Input
            id="company-filter"
            placeholder="Filter by company..."
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              handleFilterChange('company', e.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position-filter">Position</Label>
          <Input
            id="position-filter"
            placeholder="Filter by position..."
            value={positionFilter}
            onChange={(e) => {
              setPositionFilter(e.target.value);
              handleFilterChange('position', e.target.value);
            }}
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm font-medium">Sort by:</Label>
        <div className="flex gap-2">
          {[
            { key: 'created_date', label: 'Date Created' },
            { key: 'title', label: 'Title' },
            { key: 'name', label: 'Name' },
            { key: 'company', label: 'Company' },
            { key: 'view_count', label: 'Views' },
          ].map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              variant={currentSort.sortBy === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange(key)}
              className="flex items-center gap-1"
            >
              {label}
              {currentSort.sortBy === key && (
                currentSort.sortOrder === 'asc' ? 
                  <SortAsc className="h-3 w-3" /> : 
                  <SortDesc className="h-3 w-3" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Sort - Always visible */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onSort('created_date', 'desc');
          }}
          className="text-xs"
        >
          Reset Sort
        </Button>
      </div>

      {/* Active Filters Display */}
      {(hasActiveSearch || activeFiltersCount > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {hasActiveSearch && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{currentSearch}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSearchTerm('');
                  onClearSearch();
                }}
              />
            </Badge>
          )}
          
          {Object.entries(currentFilters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {key}: {value}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  if (key === 'status') setStatusFilter('all');
                  handleFilterChange(key, 'all');
                }}
              />
            </Badge>
          ))}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCompanyFilter('');
              setPositionFilter('');
              onClearSearch();
              onClearFilters();
            }}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};