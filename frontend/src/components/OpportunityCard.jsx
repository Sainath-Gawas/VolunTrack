import React from 'react';
import { useNavigate } from 'react-router-dom';

const OpportunityCard = ({ opportunity, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const dateObj = new Date(opportunity.date);
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const isFlexible = opportunity.capacity?.isFlexibleHours;
  const isUnlimited = opportunity.capacity?.isUnlimitedVolunteers;

  const urgencyStyle = {
    Normal: 'bg-slate-100 text-slate-700 border-slate-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Critical: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusStyle = {
    Open: 'bg-green-50 text-green-700 border-green-200',
    Filled: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Closed: 'bg-gray-100 text-gray-500 border-gray-200'
  };

  const isInactiveStatus = opportunity.status === 'Filled' || opportunity.status === 'Closed';

  return (
    <div 
      onClick={() => navigate(`/opportunities/${opportunity._id}`)}
      className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col sm:flex-row gap-5 group cursor-pointer"
    >
      
      {/* Left Side: Image with Floating Date Badge */}
      <div className={`w-full sm:w-48 h-48 sm:h-auto shrink-0 rounded-xl overflow-hidden relative bg-gray-100 ${isInactiveStatus ? 'opacity-80 grayscale-[0.15]' : ''}`}>
        {opportunity.imageUrl ? (
          <img src={opportunity.imageUrl} alt={opportunity.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-brand/10" />
        )}
        
        {/* Floating Date Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm min-w-[3.5rem] border border-gray-100">
          <span className="block text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">{month}</span>
          <span className="block text-xl font-black text-gray-900 leading-none">{day}</span>
        </div>
      </div>

      {/* Right Side: Content Block */}
      <div className="flex-1 min-w-0 py-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{opportunity.title}</h3>
          
          {/* Actions */}
          <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-start">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(opportunity); }} 
              className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
            >
              Edit
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(opportunity); }} 
              className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>

        <p className="text-base md:text-lg text-gray-600 mb-4">
          {opportunity.organization} • {opportunity.location?.city || 'Goa'}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {opportunity.activityType}
          </span>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${urgencyStyle[opportunity.urgency] || urgencyStyle.Normal}`}>
            {opportunity.urgency} Urgency
          </span>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${statusStyle[opportunity.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {opportunity.status}
          </span>
          <span className="px-3 py-1 rounded-lg text-sm font-medium text-gray-500 flex items-center gap-1.5">
            ⏱ {isFlexible ? 'Flexible hours' : `${opportunity.capacity?.requiredHours || 0} hrs`}
          </span>
        </div>

        {isUnlimited && (
          <div className="mt-3 text-sm font-medium text-brand">
            Unlimited capacity
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;