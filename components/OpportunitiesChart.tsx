'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function OpportunitiesChart({ opportunities }: { opportunities: any[] }) {
  if (opportunities.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">No data available for visualization</p>
      </div>
    );
  }

  // Group by agency
  const byAgency = opportunities.reduce(
    (acc: any, opp: any) => {
      const key = opp.agency || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const agencyData = Object.entries(byAgency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 10);

  // Group by set-aside type
  const bySetAside = opportunities.reduce(
    (acc: any, opp: any) => {
      const key = opp.set_aside_type || 'None';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const setAsideData = Object.entries(bySetAside).map(([name, value]) => ({
    name,
    value,
  }));

  // Opportunities by amount
  const amountBuckets: any = {
    '< $100K': 0,
    '$100K - $1M': 0,
    '$1M - $5M': 0,
    '$5M - $10M': 0,
    '> $10M': 0,
  };

  opportunities.forEach((opp: any) => {
    const amt = opp.estimated_amount || 0;
    if (amt < 100000) amountBuckets['< $100K']++;
    else if (amt < 1000000) amountBuckets['$100K - $1M']++;
    else if (amt < 5000000) amountBuckets['$1M - $5M']++;
    else if (amt < 10000000) amountBuckets['$5M - $10M']++;
    else amountBuckets['> $10M']++;
  });

  const amountData = Object.entries(amountBuckets).map(([name, count]) => ({
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
        <h3 className="text-lg font-semibold mb-4">Opportunities by Agency (Top 10)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">By Set-Aside Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={setAsideData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {setAsideData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">By Estimated Amount</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={amountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
