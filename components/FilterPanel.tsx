'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: Record<string, any>) => void;
  type?: 'opportunities' | 'awards';
}

export default function FilterPanel({ onFilterChange, type = 'opportunities' }: FilterPanelProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters };
    if (value === '' || value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const agencies = [
    'Department of Defense',
    'General Services Administration',
    'Department of Veterans Affairs',
    'Department of State',
    'Department of Transportation',
    'Department of Health and Human Services',
    'Other',
  ];

  const setAsideTypes = [
    'Small Business',
    'Woman-Owned',
    'Veteran-Owned',
    'Service-Disabled Veteran-Owned',
    'Minority-Owned',
    'HUBZone',
    'None',
  ];

  const opportunityTypes = [
    'Presolicitation',
    'Solicitation',
    'Award Notice',
    'Other',
  ];

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Agency</label>
          <select
            value={filters.agency || ''}
            onChange={(e) => handleFilterChange('agency', e.target.value)}
            className="select"
          >
            <option value="">All Agencies</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>

        {type === 'opportunities' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Set-Aside Type</label>
              <select
                value={filters.set_aside_type || ''}
                onChange={(e) => handleFilterChange('set_aside_type', e.target.value)}
                className="select"
              >
                <option value="">All Types</option>
                {setAsideTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Opportunity Type</label>
              <select
                value={filters.opportunity_type || ''}
                onChange={(e) => handleFilterChange('opportunity_type', e.target.value)}
                className="select"
              >
                <option value="">All Types</option>
                {opportunityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Min Estimated Amount</label>
              <input
                type="number"
                value={filters.min_amount || ''}
                onChange={(e) => handleFilterChange('min_amount', e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Enter minimum amount"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Estimated Amount</label>
              <input
                type="number"
                value={filters.max_amount || ''}
                onChange={(e) => handleFilterChange('max_amount', e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Enter maximum amount"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Closing Date From</label>
              <input
                type="date"
                value={filters.closing_date_from || ''}
                onChange={(e) => handleFilterChange('closing_date_from', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Closing Date To</label>
              <input
                type="date"
                value={filters.closing_date_to || ''}
                onChange={(e) => handleFilterChange('closing_date_to', e.target.value)}
                className="input"
              />
            </div>
          </>
        )}

        {type === 'awards' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Min Contract Value</label>
              <input
                type="number"
                value={filters.min_amount || ''}
                onChange={(e) => handleFilterChange('min_amount', e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Enter minimum amount"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Contract Value</label>
              <input
                type="number"
                value={filters.max_amount || ''}
                onChange={(e) => handleFilterChange('max_amount', e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Enter maximum amount"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Award Date From</label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Award Date To</label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="input"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
