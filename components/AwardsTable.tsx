'use client';

export default function AwardsTable({ awards }: { awards: any[] }) {
  if (awards.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">No contract awards found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
              <th className="px-6 py-3 text-left text-sm font-semibold">Contractor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Agency</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Award Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Contract Value</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Obligated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {awards.map((award: any) => (
              <tr key={award.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="font-medium">{award.contractor_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {award.contract_number || award.award_id}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{award.agency}</td>
                <td className="px-6 py-4 text-sm">
                  {award.award_date ? new Date(award.award_date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {award.contract_value
                    ? `$${Number(award.contract_value).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}`
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  {award.obligated_amount
                    ? `$${Number(award.obligated_amount).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
