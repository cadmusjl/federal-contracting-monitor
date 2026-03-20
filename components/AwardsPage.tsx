'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import AwardsTable from './AwardsTable';
import AwardsChart from './AwardsChart';
import FilterPanel from './FilterPanel';

export default function AwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const limit = 25;

  useEffect(() => {
    fetchAwards();
  }, [page, filters]);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      if (searchQuery) {
        params.append('search_query', searchQuery);
      }

      const response = await fetch(`/api/awards?${params}`);
      const data = await response.json();

      setAwards(data.awards || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAwards();
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleExport = () => {
    const csv = [
      ['Contractor', 'Agency', 'Award Date', 'Contract Value', 'Obligated Amount'].join(','),
      ...awards.map((award: any) =>
        [
          `"${award.contractor_name}"`,
          award.agency,
          new Date(award.award_date).toLocaleDateString(),
          award.contract_value || 'N/A',
          award.obligated_amount || 'N/A',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `awards-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search contract awards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
              />
              <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {viewMode === 'table' ? 'View Chart' : 'View Table'}
            </button>
            <button
              onClick={handleExport}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <FilterPanel onFilterChange={handleFilterChange} type="awards" />
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">⏳</div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading awards...</p>
        </div>
      ) : viewMode === 'chart' ? (
        <AwardsChart awards={awards} />
      ) : (
        <AwardsTable awards={awards} />
      )}

      {totalPages > 1 && (
        <div className="card p-4 flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
