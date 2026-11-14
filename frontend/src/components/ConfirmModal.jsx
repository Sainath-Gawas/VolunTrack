import React, { useState, useEffect } from 'react';

const ConfirmModal = ({ opportunity, busy, errorMessage, onCancel, onConfirm }) => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-serif text-xl font-semibold text-gray-900">
          Remove &lsquo;{opportunity?.title || 'this opportunity'}&rsquo;?
        </h2>
        <p className="mt-2 text-sm text-gray-600">Enter your 4-digit PIN to authorize this deletion.</p>

        <input
          type="password"
          maxLength="4"
          placeholder="0000"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.5em] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
        />

        {errorMessage && (
          <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="min-h-[44px] rounded-lg border border-gray-300 px-4 font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(pin)}
            disabled={busy || pin.length !== 4}
            className="min-h-[44px] rounded-lg bg-red-600 px-4 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;