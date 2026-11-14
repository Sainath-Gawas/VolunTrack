import React from 'react';

// EXACT matches to your seed.js activityType strings
const ACTIVITY_TYPES = [
  'Education', 'Environmental', 'Health', 'Animal Welfare', 
  'Community', 'Cultural'
];

const FilterSidebar = ({ filters, setField, toggleType, clearFilters, onApply }) => {
  const labelClass = "block text-sm font-bold text-gray-800 mb-2";
  const inputClass = "w-full h-11 px-3 rounded-lg border border-gray-300 text-base text-gray-900 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none bg-white transition-colors";

  return (
    <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-28">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900">Narrow it down</h2>
          <button 
            onClick={clearFilters}
            className="text-sm font-bold text-brand hover:text-brandHover underline decoration-brand/30 underline-offset-4 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Organization */}
          <div>
            <label className={labelClass}>Organization</label>
            <select 
              value={filters.organization}
              onChange={(e) => setField('organization', e.target.value)}
              className={inputClass}
            >
              <option value="">All organizations</option>
              {/* Added a few exact matches from your seed data */}
              <option value="Goa Eco Warriors">Goa Eco Warriors</option>
              <option value="Seva Foundation">Seva Foundation</option>
              <option value="Paws & Claws Goa">Paws & Claws Goa</option>
              <option value="Red Cross Society">Red Cross Society</option>
              <option value="Robin Hood Army">Robin Hood Army</option>
            </select>
          </div>

          {/* Activity Type */}
          <div>
            <label className={labelClass}>
              Activity type <span className="font-normal text-gray-500">(pick any)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map(type => {
                const isActive = filters.types.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      isActive 
                        ? 'bg-brand border-brand text-white' 
                        : 'bg-white border-gray-300 text-gray-700 hover:border-brand hover:text-brand'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setField('status', e.target.value)}
              className={inputClass}
            >
              <option value="any">Any status</option>
              <option value="hideClosed">Hide closed</option>
              <option value="Open">Open only</option>
            </select>
          </div>

          {/* Hours Needed */}
          <div>
            <label className={labelClass}>Hours needed</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min="1"
                value={filters.minHours}
                onChange={(e) => setField('minHours', e.target.value)}
                className={inputClass} 
              />
              <span className="text-sm font-medium text-gray-500">to</span>
              <input 
                type="number" 
                min="1"
                value={filters.maxHours}
                onChange={(e) => setField('maxHours', e.target.value)}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Happening from</label>
              <input 
                type="date" 
                value={filters.from}
                onChange={(e) => setField('from', e.target.value)}
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Until</label>
              <input 
                type="date" 
                value={filters.to}
                onChange={(e) => setField('to', e.target.value)}
                className={inputClass} 
              />
            </div>
          </div>

          <button 
            onClick={onApply}
            className="w-full h-12 mt-2 bg-brand text-white text-base font-bold rounded-lg hover:bg-brandHover transition-colors shadow-sm"
          >
            Apply filters
          </button>

        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;