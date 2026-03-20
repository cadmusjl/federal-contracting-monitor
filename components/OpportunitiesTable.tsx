'use client';

import { formatDistanceToNow } from 'date-fns';

export default function OpportunitiesTable({ opportunities }: { opportunities: any[] }) {
  if (opportunities.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">No opportunities found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Agency</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Closing Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Set-Aside</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {opportunities.map((opp: any) => (
              <tr key={opp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <a
                      href={opp.sam_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {opp.title.substring(0, 80)}
                    </a>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {opp.opportunity_type || 'N/A'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{opp.agency}</td>
                <td className="px-6 py-4 text-sm">
                  {opp.closing_date ? (
                    <div>
                      <div>{new Date(opp.closing_date).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDistanceToNow(new Date(opp.closing_date), { addSuffix: true })}
                      </div>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {opp.estimated_amount
                    ? `$${Number(opp.estimated_amount).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}`
                    : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {opp.set_aside_type ? (
                    <span className="badge badge-success text-xs">{opp.set_aside_type}</span>
                  ) : (
                    <span className="text-sm text-slate-500">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
