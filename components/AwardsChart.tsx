'use client';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AwardsChart({ awards }: { awards: any[] }) {
  if (awards.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">No data available for visualization</p>
      </div>
    );
  }

  // Group by agency
  const byAgency = awards.reduce(
    (acc: any, award: any) => {
      const key = award.agency || 'Unknown';
      if (!acc[key]) {
        acc[key] = { name: key, count: 0, total: 0 };
      }
      acc[key].count += 1;
      acc[key].total += award.contract_value || 0;
      return acc;
    },
    {}
  );

  const agencyData = Object.values(byAgency)
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 10);

  // Top contractors
  const byContractor = awards.reduce(
    (acc: any, award: any) => {
      const key = award.contractor_name || 'Unknown';
      if (!acc[key]) {
        acc[key] = { name: key, count: 0, total: 0 };
      }
      acc[key].count += 1;
      acc[key].total += award.contract_value || 0;
      return acc;
    },
    {}
  );

  const contractorData = Object.values(byContractor)
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 10);

  // Contract value distribution
  const valueBuckets: any = {
    '< $100K': 0,
    '$100K - $1M': 0,
    '$1M - $5M': 0,
    '$5M - $10M': 0,
    '> $10M': 0,
  };

  awards.forEach((award: any) => {
    const amt = award.contract_value || 0;
    if (amt < 100000) valueBuckets['< $100K']++;
    else if (amt < 1000000) valueBuckets['$100K - $1M']++;
    else if (amt < 5000000) valueBuckets['$1M - $5M']++;
    else if (amt < 10000000) valueBuckets['$5M - $10M']++;
    else valueBuckets['> $10M']++;
  });

  const valueData = Object.entries(valueBuckets).map(([name, count]) => ({
    name,
    count,
  }));

  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#06b6d4',
    '#84cc16',
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Total Award Value by Agency (Top 10)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={agencyData}
            layout="vertical"
            margin={{ left: 150 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={140} />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Top Contractors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={contractorData}
              layout="vertical"
              margin={{ left: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={110} />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">By Contract Value</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={valueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }: any) => `${name}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {valueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
