import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState([]);
  const [urgencyItems, setUrgencyItems] = useState([]);

  // Updated to include lifetime opportunities
  const [totals, setTotals] = useState({
    lifetime: 0,
    active: 0,
    hours: 0,
    volunteers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all dashboard statistics from MongoDB
        const response = await api.get('/opportunities/stats');

        const data = response.data;

        // Summary calculated by MongoDB
        setTotals({
          lifetime: data.summary?.totalLifetime || 0,
          active: data.summary?.totalActive || 0,
          hours: data.summary?.totalHoursPledged || 0,
          volunteers: data.summary?.totalVolunteersNeeded || 0
        });

        // Category breakdown calculated by MongoDB
        setStatsData(data.categoryBreakdown || []);

        // Urgent opportunities filtered by MongoDB
        setUrgencyItems(data.urgencyItems || []);

      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-lg text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  // Calculate maximum category count for progress bar scaling
  const maxCount = Math.max(
    ...statsData.map(s => s.count),
    1
  );

  const KPI = ({ label, value, accent }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-bold ${accent}`}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">

      <div className="border-b border-gray-200 pb-6">
        <h1 className="font-serif text-4xl text-gray-900">
          VolunTrack dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Operational snapshot across all active community programs.
        </p>
      </div>

      {/* Dashboard statistics - Updated to 4 columns */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KPI
          label="Lifetime Opportunities"
          value={totals.lifetime}
          accent="text-gray-900"
        />

        <KPI
          label="Active Opportunities"
          value={totals.active}
          accent="text-brand"
        />

        <KPI
          label="Volunteers Needed"
          value={totals.volunteers}
          accent="text-gray-900"
        />

        <KPI
          label="Total Hours Pledged"
          value={totals.hours}
          accent="text-brand"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Needs attention */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Needs attention
            </h2>

            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
              {urgencyItems.length} urgent
            </span>
          </div>

          <div className="space-y-3">
            {urgencyItems.length === 0 ? (
              <p className="text-sm text-gray-500">
                No high-priority opportunities are due in the next 14 days.
              </p>
            ) : (
              urgencyItems.map((opp) => (
                <div
                  key={opp._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {opp.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(opp.date).toLocaleDateString()}
                      {' · '}
                      {opp.activityType}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/opportunities/${opp._id}`)
                    }
                    className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brandHover"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Category breakdown
          </h2>

          <div className="space-y-4">
            {statsData.map((stat) => {
              const percentage = Math.max(
                (stat.count / maxCount) * 100,
                12
              );

              return (
                <div key={stat.activityType}>
                  <div className="mb-1 flex items-center justify-between text-sm text-gray-700">
                    <span className="font-medium">
                      {stat.activityType || 'Other'}
                    </span>
                    <span>{stat.count}</span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;