import React, { useState, useEffect } from 'react';
import { vehicleAPI } from '../services/api';
import { Vehicle, SearchFilters } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Filter, RefreshCw, Car, CheckCircle2, AlertTriangle } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    make: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchVehicles = async (searchFilters?: SearchFilters) => {
    setLoading(true);
    setError('');
    try {
      let data: Vehicle[];
      if (
        searchFilters &&
        (searchFilters.make || searchFilters.category || searchFilters.minPrice || searchFilters.maxPrice)
      ) {
        data = await vehicleAPI.search(searchFilters);
      } else {
        data = await vehicleAPI.getAll();
      }
      setVehicles(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const debouncedMake = useDebounce(filters.make, 400);

  useEffect(() => {
    fetchVehicles(filters);
  }, [debouncedMake]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles(filters);
  };

  const handleResetFilters = () => {
    const reset = { make: '', category: '', minPrice: '', maxPrice: '' };
    setFilters(reset);
    fetchVehicles(reset);
  };

  const handlePurchase = async (id: string) => {
    try {
      const res = await vehicleAPI.purchase(id);
      setNotification({
        type: 'success',
        message: `Congratulations! ${res.vehicle.make} ${res.vehicle.model} purchased successfully!`,
      });
      // Update local vehicle state to immediately reflect reduced stock
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? { ...v, quantity: res.vehicle.quantity } : v))
      );
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.response?.data?.error || 'Purchase failed',
      });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center space-x-3 text-sm animate-in slide-in-from-top-5 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="glass-panel rounded-3xl p-8 mb-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Car className="w-3.5 h-3.5" />
            <span>Premium Showroom Catalog</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discover & Acquire <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Exceptional Vehicles</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Explore live inventory with real-time stock status. Log in to instantly reserve and purchase your dream vehicle.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <form onSubmit={handleSearchSubmit} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <input
              type="text"
              placeholder="Search Make (e.g. Toyota)..."
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Coupe">Coupe</option>
              <option value="Electric">Electric</option>
              <option value="Truck">Truck</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
            </select>
          </div>

          <div>
            <input
              type="number"
              placeholder="Min Price ($)"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Max Price ($)"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Fetching live inventory...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 rounded-2xl text-center text-red-400 max-w-md mx-auto">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => fetchVehicles()}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
          >
            Retry Loading
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
          <Car className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-white mb-1">No Vehicles Match Your Filter</h3>
          <p className="text-sm">Try resetting or adjusting your search criteria.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
};
