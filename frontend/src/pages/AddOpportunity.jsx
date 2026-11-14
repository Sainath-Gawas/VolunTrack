import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const imageMap = {
  Environmental: [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLQ6uxj6X9Imd3EIE3xmTHQVy8Hc6R_5_-IPcpKrCPlYUk7q_zXi--JmMC&s=10',
    'https://images.unsplash.com/photo-1786618433742-69eaedbcf4ff?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80'
  ],
  Education: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509869175650-a1d97972541a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
  ],
  Health: [
    'https://plus.unsplash.com/premium_photo-1682309740788-04a5451ee019?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    'https://plus.unsplash.com/premium_photo-1681488218637-394540144bb0?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    'https://plus.unsplash.com/premium_photo-1769857353473-fab6c15159e0?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
  ],
  Community: [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREFeJUVziFO5B4hos7ZR4rU9I3IX0bWsrS4GpE2eG8QgLWZc5ewstfJls&s=10',
    'https://media.assettype.com/businessindia%2F2025-01-28%2Fo66uasj3%2FMumbai-Marothan-2025-opt.jpeg',
    'https://media.istockphoto.com/id/1420066200/photo/group-of-volunteers-picking-up-trash-and-plastic-in-the-nature.jpg?s=612x612&w=0&k=20&c=U90YaU-vP9pa64i9XCyaVFfSuFvQsEyqH09vSw2i7CE='
  ],
  'Animal Welfare': [
    'https://vspca.org/wp-content/uploads/2023/03/cats-3-1440x1080.jpeg',
    'https://media.istockphoto.com/id/693543164/photo/street-dog-and-ginger-kitten-feeding-food-in-car-junkyard.jpg?s=612x612&w=0&k=20&c=bWtlHRoh7rQoF4EObNIqzkCXPYf7voSqBqBeLGh1vqQ=',
    'https://images.pexels.com/photos/33336303/pexels-photo-33336303.jpeg?cs=srgb&dl=pexels-aleson-padilha-945919991-33336303.jpg&fm=jpg'
  ],
  Cultural: [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3hRcO-Y0ImIVrNlScljfyo_CwhBHrSOx9HewbpfinMZyJVHiHYDI8CUM&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIGY3VgSriHF7QGWf_9HMfDOgst6lW5tHFPIJT8K5RU4eYRE3A62rPrM8&s=10',
    'https://freevolunteering.net/wp-content/uploads/2024/09/volunteering-in-India.jpg'
  ]
};

const initialForm = {
  title: '',
  description: '',
  organization: '',
  activityType: 'Education',
  date: '',
  urgency: 'Normal',
  status: 'Open',
  passcode: '',
  imageUrl: '',
  skillsRequired: '',
  capacity: {
    isFlexibleHours: false,
    requiredHours: '',
    isUnlimitedVolunteers: false,
    volunteersNeeded: '',
    volunteersSignedUp: 0
  },
  location: {
    city: '',
    pinCode: ''
  },
  contactPerson: {
    name: '',
    email: ''
  }
};

const fieldClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand';

const AddOpportunity = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const editId = params.id || searchParams.get('edit');

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(editId));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = useMemo(() => Boolean(editId), [editId]);
  const availableImages = imageMap[form.activityType] || [];

  useEffect(() => {
    const loadOpportunity = async () => {
      if (!editId) return;

      try {
        const response = await api.get(`/opportunities/${editId}`);
        const data = response.data;

        setForm({
          title: data.title || '',
          description: data.description || '',
          organization: data.organization || '',
          activityType: data.activityType || 'Education',
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '',
          urgency: data.urgency || 'Normal',
          status: data.status || 'Open',
          passcode: data.passcode || '',
          imageUrl: data.imageUrl || '',
          skillsRequired: Array.isArray(data.skillsRequired) ? data.skillsRequired.join(', ') : '',
          capacity: {
            isFlexibleHours: Boolean(data.capacity?.isFlexibleHours),
            requiredHours: data.capacity?.isFlexibleHours ? '' : (data.capacity?.requiredHours ?? ''),
            isUnlimitedVolunteers: Boolean(data.capacity?.isUnlimitedVolunteers),
            volunteersNeeded: data.capacity?.isUnlimitedVolunteers ? '' : (data.capacity?.volunteersNeeded ?? ''),
            volunteersSignedUp: data.capacity?.volunteersSignedUp ?? 0
          },
          location: {
            city: data.location?.city || '',
            pinCode: data.location?.pinCode || ''
          },
          contactPerson: {
            name: data.contactPerson?.name || '',
            email: data.contactPerson?.email || ''
          }
        });
      } catch (loadError) {
        setError(loadError?.response?.data?.message || 'Unable to load this opportunity.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunity();
  }, [editId]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (group, field, value) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value
      }
    }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');
  setSuccess('');
  setIsSubmitting(true);

  const capacity = {
    ...form.capacity,
    requiredHours: form.capacity.isFlexibleHours ? null : Number(form.capacity.requiredHours || 0),
    volunteersNeeded: form.capacity.isUnlimitedVolunteers ? null : Number(form.capacity.volunteersNeeded || 0),
    volunteersSignedUp: Number(form.capacity.volunteersSignedUp || 0)
  };

  const payload = {
    ...form,
    skillsRequired: form.skillsRequired
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    capacity,
    location: {
      ...form.location,
      pinCode: String(form.location.pinCode)
    }
  };

  try {
    if (isEditMode) {
      await api.put(`/opportunities/${editId}`, payload);
      setSuccess('Opportunity updated successfully.');
      setTimeout(() => navigate('/opportunities'), 1000);
    } else {
      await api.post('/opportunities', payload);
      setSuccess('Opportunity created successfully.');
      setForm(initialForm);
      setTimeout(() => navigate('/opportunities'), 1000);
    }
  } catch (submitError) {
    const message = submitError?.response?.data?.message || 'Something went wrong. Please try again.';
    setError(message);
  } finally {
    setIsSubmitting(false);
  }
};

  const toggleFlexibleHours = () => {
    setForm((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        isFlexibleHours: !prev.capacity.isFlexibleHours,
        requiredHours: prev.capacity.isFlexibleHours ? '' : ''
      }
    }));
  };

  const toggleUnlimitedCapacity = () => {
    setForm((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        isUnlimitedVolunteers: !prev.capacity.isUnlimitedVolunteers,
        volunteersNeeded: prev.capacity.isUnlimitedVolunteers ? '' : ''
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-lg text-gray-500">
        Loading opportunity details...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-gray-900">
          {isEditMode ? 'Edit Opportunity' : 'Post an Opportunity'}
        </h1>
        <p className="mt-2 text-base text-gray-600">
          {isEditMode ? 'Update this listing with the latest details.' : 'Create a new opportunity for the community board.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-800">Opportunity title</label>
            <input
              value={form.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className={fieldClass}
              placeholder="Beach cleanup drive"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-800">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className={`${fieldClass} min-h-[140px]`}
              placeholder="Describe the opportunity, responsibilities, and impact."
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Organization</label>
            <input
              value={form.organization}
              onChange={(e) => handleFieldChange('organization', e.target.value)}
              className={fieldClass}
              placeholder="Goa Eco Warriors"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Activity type</label>
            <select
              value={form.activityType}
              onChange={(e) => handleFieldChange('activityType', e.target.value)}
              className={fieldClass}
              required
            >
              <option>Education</option>
              <option>Environmental</option>
              <option>Health</option>
              <option>Animal Welfare</option>
              <option>Community</option>
              <option>Cultural</option>
            </select>

            <div className="mt-4">
              {!form.activityType ? (
                <p className="text-sm text-gray-500">Select a type to view available cover images.</p>
              ) : (
                <div className="space-y-4">
                  {/* Curated Thumbnails */}
                  <div className="grid grid-cols-3 gap-3">
                    {availableImages.map((imageUrl) => {
                      const isSelected = form.imageUrl === imageUrl;
                      return (
                        <button
                          key={imageUrl}
                          type="button"
                          onClick={() => handleFieldChange('imageUrl', imageUrl)}
                          className={`relative overflow-hidden rounded-xl border-2 transition duration-150 ${isSelected ? 'scale-[1.02] border-brand ring-2 ring-brand/20' : 'border-gray-200 hover:border-brand/70'}`}
                        >
                          <img src={imageUrl} alt={form.activityType} className="h-24 w-full object-cover" />
                          {isSelected && (
                            <span className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Custom URL Fallback */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Or paste a custom image URL</label>
                    <input 
                      type="url" 
                      value={form.imageUrl} 
                      onChange={(e) => handleFieldChange('imageUrl', e.target.value)} 
                      className={fieldClass} 
                      placeholder="https://example.com/our-event-flyer.jpg" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Event date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Urgency</label>
            <select
              value={form.urgency}
              onChange={(e) => handleFieldChange('urgency', e.target.value)}
              className={fieldClass}
            >
              <option>Normal</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className={fieldClass}
            >
              <option>Open</option>
              <option>Filled</option>
              <option>Closed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">4-digit PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength="4"
              value={form.passcode}
              onChange={(e) => handleFieldChange('passcode', e.target.value.replace(/\D/g, '').slice(0, 4))}
              className={fieldClass}
              placeholder="1234"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-800">Skills required</label>
            <input
              value={form.skillsRequired}
              onChange={(e) => handleFieldChange('skillsRequired', e.target.value)}
              className={fieldClass}
              placeholder="Communication, event coordination, photography"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Required hours</label>
            <input
              type="number"
              min="1"
              value={form.capacity.requiredHours}
              onChange={(e) => handleNestedFieldChange('capacity', 'requiredHours', e.target.value)}
              className={fieldClass}
              disabled={form.capacity.isFlexibleHours}
              required={!form.capacity.isFlexibleHours}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Volunteers needed</label>
            <input
              type="number"
              min="1"
              value={form.capacity.volunteersNeeded}
              onChange={(e) => handleNestedFieldChange('capacity', 'volunteersNeeded', e.target.value)}
              className={fieldClass}
              disabled={form.capacity.isUnlimitedVolunteers}
              required={!form.capacity.isUnlimitedVolunteers}
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.capacity.isFlexibleHours}
                  onChange={toggleFlexibleHours}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                Flexible Hours
              </label>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.capacity.isUnlimitedVolunteers}
                  onChange={toggleUnlimitedCapacity}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                Unlimited Capacity
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">City</label>
            <input
              value={form.location.city}
              onChange={(e) => handleNestedFieldChange('location', 'city', e.target.value)}
              className={fieldClass}
              placeholder="Panaji"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">PIN code</label>
            <input
              value={form.location.pinCode}
              onChange={(e) => handleNestedFieldChange('location', 'pinCode', e.target.value)}
              className={fieldClass}
              placeholder="403001"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Contact name</label>
            <input
              value={form.contactPerson.name}
              onChange={(e) => handleNestedFieldChange('contactPerson', 'name', e.target.value)}
              className={fieldClass}
              placeholder="Example"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">Contact email</label>
            <input
              type="email"
              value={form.contactPerson.email}
              onChange={(e) => handleNestedFieldChange('contactPerson', 'email', e.target.value)}
              className={fieldClass}
              placeholder="example@example.com"
              required
            />
          </div>
        </div>

        {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
        {success && <p className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{success}</p>}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/opportunities')}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white hover:bg-brandHover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (isEditMode ? 'Saving...' : 'Posting...') : isEditMode ? 'Save Changes' : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOpportunity;