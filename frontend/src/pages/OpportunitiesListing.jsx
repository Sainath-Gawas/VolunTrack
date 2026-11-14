import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import FilterSidebar from '../components/FilterSidebar';
import ConfirmModal from '../components/ConfirmModal';
import EditPinModal from '../components/EditPinModal';

const DEFAULT_FILTERS = {
  organization: '',
  types: [],
  status: 'hideClosed',
  minHours: '',
  maxHours: '',
  from: '',
  to: ''
};

const OpportunitiesListing = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('soonest');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [applyTrigger, setApplyTrigger] = useState(0);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingEdit, setPendingEdit] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [editError, setEditError] = useState('');

  const buildParams = () => {
    const params = {};

    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (filters.organization) params.organization = filters.organization;
    if (filters.types.length > 0) params.type = filters.types.join(',');

    if (filters.status === 'hideClosed') params.excludeStatus = 'Closed';
    else if (filters.status !== 'any') params.status = filters.status;

    if (filters.minHours) params.minHours = filters.minHours;
    if (filters.maxHours) params.maxHours = filters.maxHours;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;

    if (sortOption === 'soonest') {
      params.sort = 'date';
      params.order = 'asc';
    } else if (sortOption === 'newest') {
      params.sort = 'createdAt';
      params.order = 'desc';
    }

    return params;
  };

  const fetchOpportunities = async (params = buildParams()) => {
    try {
      setLoading(true);
      const response = await api.get('/opportunities', { params });
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOpportunities(buildParams());
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, sortOption, applyTrigger]);

  const setField = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

  const toggleType = (type) =>
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter((item) => item !== type) : [...prev.types, type]
    }));

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setApplyTrigger((prev) => prev + 1);
  };

  const handleApplyFilters = () => {
    setApplyTrigger((prev) => prev + 1);
    fetchOpportunities(buildParams());
  };

  const handleEdit = (opportunity) => {
    setEditError('');
    setPendingEdit(opportunity);
  };

  const handleDelete = (opportunity) => {
    setDeleteError('');
    setPendingDelete(opportunity);
  };

  const handleConfirmEdit = async (pin) => {
    if (!pendingEdit) return;

    setEditBusy(true);
    setEditError('');

    try {
      await api.post(`/opportunities/${pendingEdit._id}/verify-passcode`, { passcode: pin });
      setPendingEdit(null);
      navigate(`/opportunities/${pendingEdit._id}/edit`);
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to verify this PIN.';
      setEditError(message);
    } finally {
      setEditBusy(false);
    }
  };

  const handleConfirmDelete = async (pin) => {
    if (!pendingDelete) return;

    setDeleteBusy(true);
    setDeleteError('');

    try {
      await api.delete(`/opportunities/${pendingDelete._id}`, {
        data: { passcode: pin }
      });

      setOpportunities((prev) => prev.filter((opportunity) => opportunity._id !== pendingDelete._id));
      setPendingDelete(null);
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to delete this opportunity.';
      setDeleteError(message);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-gray-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-3 tracking-tight">
          The opportunity board
        </h1>
        <p className="text-lg text-gray-600">
          Saturday, 14 November · {opportunities.length} notices pinned up
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, e.g. beach clean-up"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 text-base text-gray-900 focus:border-brand focus:ring-2 focus:ring-brand focus:outline-none transition bg-white shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-4 h-12 shadow-sm shrink-0 focus-within:ring-2 focus-within:ring-brand focus-within:border-brand transition">
          <span className="text-base text-gray-500 font-medium">Sort by</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-base font-bold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="soonest">Date, soonest first</option>
            <option value="newest">Newly added</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar
          filters={filters}
          setField={setField}
          toggleType={toggleType}
          clearFilters={clearFilters}
          onApply={handleApplyFilters}
        />

        <section className="flex-1 w-full min-w-0">
          <div className="space-y-5">
            {loading ? (
              <div className="flex justify-center p-12 text-lg text-gray-500">Loading opportunities...</div>
            ) : opportunities.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-sm">
                <p className="text-xl font-medium text-gray-900 mb-2">No opportunities found.</p>
                <p className="text-base text-gray-500">Try loosening a filter and the board fills back up.</p>
                <button onClick={clearFilters} className="mt-4 bg-brand text-white px-6 py-2 rounded-lg hover:bg-brandHover">
                  Clear Filters
                </button>
              </div>
            ) : (
              opportunities.map((opp) => (
                <OpportunityCard key={opp._id} opportunity={opp} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            )}
          </div>
        </section>
      </div>

      {pendingEdit && (
        <EditPinModal
          opportunity={pendingEdit}
          busy={editBusy}
          errorMessage={editError}
          onCancel={() => {
            setPendingEdit(null);
            setEditError('');
          }}
          onConfirm={handleConfirmEdit}
        />
      )}

      {pendingDelete && (
        <ConfirmModal
          opportunity={pendingDelete}
          busy={deleteBusy}
          errorMessage={deleteError}
          onCancel={() => {
            setPendingDelete(null);
            setDeleteError('');
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default OpportunitiesListing;