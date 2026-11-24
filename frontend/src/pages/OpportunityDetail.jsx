import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/opportunities/${id}`);
        setOpportunity(response.data);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-lg text-gray-500">Loading details...</div>;
  }
  
  if (!opportunity) {
    return <div className="p-12 text-center text-lg text-red-500">Opportunity not found.</div>;
  }

  const handleJoin = async () => {
    setJoining(true);
    setJoinError('');
    try {
      const response = await api.post(`/opportunities/${id}/join`);
      setOpportunity(response.data);
      setHasJoined(true);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to join opportunity.';
      setJoinError(message);
    } finally {
      setJoining(false);
    }
  };

  const dateObj = new Date(opportunity.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const isFlexible = opportunity.capacity?.isFlexibleHours;
  const isUnlimited = opportunity.capacity?.isUnlimitedVolunteers;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-brand font-bold flex items-center gap-2 hover:underline transition-all"
      >
        ← Back to board
      </button>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Hero Image Section */}
        {opportunity.imageUrl && (
          <div className="w-full h-64 md:h-80 overflow-hidden bg-gray-100">
            <img 
              src={opportunity.imageUrl} 
              alt={opportunity.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700">
                {opportunity.activityType}
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                opportunity.urgency === 'Critical' 
                ? 'bg-red-100 text-red-800 border-red-200' 
                : opportunity.urgency === 'High'
                ? 'bg-orange-100 text-orange-800 border-orange-200'
                : 'bg-green-100 text-green-800 border-green-200'
              }`}>
                {opportunity.urgency} Urgency
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                opportunity.status === 'Open'
                ? 'bg-green-50 text-green-700 border-green-200'
                : opportunity.status === 'Filled'
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {opportunity.status}
              </span>
            </div>

            {/* Header Join Button */}
            <div>
              {hasJoined ? (
                <button
                  disabled
                  className="px-5 py-2 rounded-xl font-bold text-sm bg-emerald-600 text-white cursor-default shadow-sm flex items-center justify-center gap-1.5"
                >
                  Joined ✓
                </button>
              ) : opportunity.status === 'Open' ? (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="px-5 py-2 rounded-xl font-bold text-sm bg-brand text-white hover:bg-brandHover disabled:opacity-60 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {joining ? 'Joining...' : 'Join Opportunity'}
                </button>
              ) : (
                <button
                  disabled
                  className="px-5 py-2 rounded-xl font-medium text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  {opportunity.status === 'Filled' ? 'Opportunity Filled' : 'Opportunity Closed'}
                </button>
              )}
            </div>
          </div>

          {joinError && (
            <p className="mb-3 text-sm font-medium text-red-600">{joinError}</p>
          )}
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            {opportunity.title}
          </h1>
          <p className="text-xl text-gray-600">
            Hosted by <span className="font-bold text-gray-900">{opportunity.organization}</span>
          </p>
        </div>

        {/* Details Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Left Column: Description & Skills */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this opportunity</h2>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </section>
            
            {opportunity.skillsRequired && opportunity.skillsRequired.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Skills Needed</h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skillsRequired.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Logistics */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">When</p>
              <p className="text-base font-medium text-gray-900">{formattedDate}</p>
              <p className="text-base text-gray-600">
                {isFlexible ? 'Flexible hours' : `${opportunity.capacity?.requiredHours || 0} hours required`}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Where</p>
              <p className="text-base font-medium text-gray-900">{opportunity.location?.city}</p>
              <p className="text-base text-gray-600">PIN: {opportunity.location?.pinCode}</p>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
              <p className="text-base font-medium text-gray-900">
                {isUnlimited ? 'Unlimited capacity' : `${opportunity.capacity?.volunteersSignedUp || 0} / ${opportunity.capacity?.volunteersNeeded || 0} volunteers`}
              </p>

              {/* Capacity Section Action */}
              <div className="mt-4">
                {hasJoined ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-lg font-bold text-sm bg-emerald-600 text-white cursor-default shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Joined ✓
                  </button>
                ) : opportunity.status === 'Open' ? (
                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full py-2.5 px-4 rounded-lg font-bold text-sm bg-brand text-white hover:bg-brandHover disabled:opacity-60 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {joining ? 'Joining...' : 'Join Opportunity'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-lg font-medium text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    {opportunity.status === 'Filled' ? 'Opportunity Filled' : 'Opportunity Closed'}
                  </button>
                )}
                {joinError && (
                  <p className="mt-2 text-xs font-medium text-red-600">{joinError}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Contact</p>
              <p className="text-base font-medium text-gray-900">{opportunity.contactPerson?.name}</p>
              <a href={`mailto:${opportunity.contactPerson?.email}`} className="text-brand hover:underline font-medium">
                {opportunity.contactPerson?.email}
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;