'use client';

import { useState } from 'react';
import OpportunitiesPage from '@/components/OpportunitiesPage';
import AwardsPage from '@/components/AwardsPage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'awards'>('opportunities');

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Federal Contracting Monitor</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Real-time federal contracting opportunities and spending analysis
        </p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'opportunities'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Opportunities
        </button>
        <button
          onClick={() => setActiveTab('awards')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'awards'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Contract Awards
        </button>
      </div>

      {activeTab === 'opportunities' && <OpportunitiesPage />}
      {activeTab === 'awards' && <AwardsPage />}
    </div>
  );
}
