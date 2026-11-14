import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/opportunities', {
          params: {
            sort: 'createdAt',
            order: 'desc'
          }
        });
        setOpportunities(response.data || []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const active = opportunities.filter((opp) => opp.status === 'Open');
    const totalActive = active.length;
    const totalVolunteersNeeded = active.reduce(
      (sum, opp) => sum + Math.max((opp.capacity?.volunteersNeeded || 0) - (opp.capacity?.volunteersSignedUp || 0), 0),
      0
    );
    const totalHoursPledged = opportunities.reduce((sum, opp) => sum + (opp.capacity?.requiredHours || 0), 0);

    const urgencyItems = opportunities.filter((opp) => {
      const date = new Date(opp.date);
      const diffDays = (date - new Date()) / (1000 * 60 * 60 * 24);
      return (opp.urgency === 'High' || opp.urgency === 'Critical') && diffDays >= 0 && diffDays <= 14;
    });

    const categoryMap = {};
    opportunities.forEach((opp) => {
      const label = opp.activityType || 'Other';
      categoryMap[label] = (categoryMap[label] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(categoryMap), 1);
    const categoryBreakdown = Object.entries(categoryMap).map(([label, count]) => ({
      label,
      count,
      percentage: Math.max((count / maxCount) * 100, 12)
    }));

    return { totalActive, totalVolunteersNeeded, totalHoursPledged, urgencyItems, categoryBreakdown };
  }, [opportunities]);

  if (loading) {
    return <div className="text-lg text-gray-500">Loading dashboard...</div>;
  }

  const KPI = ({ label, value, accent }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="font-serif text-4xl text-gray-900">VolunTrack dashboard</h1>
        <p className="mt-2 text-gray-600">Operational snapshot across all active community programs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPI label="Total Active Opportunities" value={stats.totalActive} accent="text-brand" />
        <KPI label="Volunteers Needed" value={stats.totalVolunteersNeeded} accent="text-gray-900" />
        <KPI label="Total Hours Pledged" value={stats.totalHoursPledged} accent="text-brand" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Needs attention</h2>
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
              {stats.urgencyItems.length} urgent
            </span>
          </div>

          <div className="space-y-3">
            {stats.urgencyItems.length === 0 ? (
              <p className="text-sm text-gray-500">No high-priority opportunities are due in the next 14 days.</p>
            ) : (
              stats.urgencyItems.map((opp) => (
                <div key={opp._id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div>
                    <p className="font-semibold text-gray-900">{opp.title}</p>
                    <p className="text-xs text-gray-500">{new Date(opp.date).toLocaleDateString()} • {opp.activityType}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/opportunities/${opp._id}`)}
                    className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brandHover"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Category breakdown</h2>
          <div className="space-y-4">
            {stats.categoryBreakdown.map(({ label, count, percentage }) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between text-sm text-gray-700">
                  <span className="font-medium">{label}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;