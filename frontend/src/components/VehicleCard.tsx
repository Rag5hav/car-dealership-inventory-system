import React, { useState } from 'react';
import { Vehicle } from '../types';
import { ShoppingCart, CheckCircle, AlertTriangle, Tag, Gauge } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => Promise<void>;
  isAuthenticated: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPurchase, isAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const isOutOfStock = vehicle.quantity <= 0;

  const handlePurchase = async () => {
    if (isOutOfStock || loading) return;
    setLoading(true);
    try {
      await onPurchase(vehicle._id);
    } finally {
      setLoading(false);
    }
  };

  // Image placeholder generator based on category
  const getCategoryImage = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('suv')) return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('electric') || cat.includes('sedan')) return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('coupe') || cat.includes('sports')) return 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        {/* Vehicle Image & Stock Badge Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={getCategoryImage(vehicle.category)}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/90 text-white shadow-lg backdrop-blur-md">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white shadow-lg backdrop-blur-md">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>In Stock ({vehicle.quantity})</span>
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/80 text-blue-300 border border-blue-500/30 backdrop-blur-md flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{vehicle.category}</span>
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {vehicle.make} <span className="text-blue-400 font-semibold">{vehicle.model}</span>
            </h3>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-sm mb-4">
            <div className="flex items-center space-x-1">
              <Gauge className="w-4 h-4 text-slate-500" />
              <span>Model Year: 2024</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              ${vehicle.price.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-0">
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || loading || !isAuthenticated}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${
            isOutOfStock
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : !isAuthenticated
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : loading
              ? 'bg-blue-700 text-white cursor-wait opacity-80'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98]'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {isOutOfStock
              ? 'Sold Out'
              : !isAuthenticated
              ? 'Login to Purchase'
              : loading
              ? 'Processing...'
              : 'Purchase Vehicle'}
          </span>
        </button>
      </div>
    </div>
  );
};
