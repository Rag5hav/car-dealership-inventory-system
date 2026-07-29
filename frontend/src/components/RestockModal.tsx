import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, PackagePlus } from 'lucide-react';

interface RestockModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onRestock: (id: string, amount: number) => Promise<void>;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onRestock,
}) => {
  const [quantity, setQuantity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      setError('Please enter a valid positive integer');
      return;
    }
    setLoading(true);
    try {
      await onRestock(vehicle._id, quantity);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700/60 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Restock Vehicle Inventory</h2>
              <p className="text-xs text-slate-400">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs text-slate-300">
          <span>Current Units in Stock:</span>
          <span className="text-sm font-bold text-emerald-400">{vehicle.quantity}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Units to Add *
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm font-bold"
              required
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all"
            >
              {loading ? 'Restocking...' : `Restock (+${quantity} Units)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
