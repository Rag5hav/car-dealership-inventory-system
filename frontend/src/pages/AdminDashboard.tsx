import React, { useState, useEffect } from 'react';
import { vehicleAPI } from '../services/api';
import { Vehicle, VehicleFormData } from '../types';
import { VehicleFormModal } from '../components/VehicleFormModal';
import { RestockModal } from '../components/RestockModal';
import {
  Plus,
  Edit2,
  Trash2,
  PackagePlus,
  Shield,
  Car,
  AlertTriangle,
  DollarSign,
  Boxes,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleAPI.getAll();
      setVehicles(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOrUpdate = async (formData: VehicleFormData) => {
    if (editingVehicle) {
      const updated = await vehicleAPI.update(editingVehicle._id, formData);
      setVehicles((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
      showToast('success', `${updated.make} ${updated.model} updated successfully`);
    } else {
      const created = await vehicleAPI.create(formData);
      setVehicles((prev) => [created, ...prev]);
      showToast('success', `${created.make} ${created.model} added to inventory`);
    }
  };

  const handleDelete = async (id: string, make: string, model: string) => {
    if (!window.confirm(`Are you sure you want to delete ${make} ${model}?`)) return;
    try {
      await vehicleAPI.delete(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      showToast('success', `${make} ${model} deleted successfully`);
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Delete failed');
    }
  };

  const handleRestock = async (id: string, quantityToAdd: number) => {
    const res = await vehicleAPI.restock(id, quantityToAdd);
    setVehicles((prev) =>
      prev.map((v) => (v._id === id ? { ...v, quantity: res.vehicle.quantity } : v))
    );
    showToast('success', `Restocked ${res.vehicle.make} ${res.vehicle.model} (+${quantityToAdd} units)`);
  };

  // Metrics
  const totalFleetValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;

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

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Shield className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dealership Inventory Management</h1>
        </div>

        <button
          onClick={() => {
            setEditingVehicle(null);
            setIsFormModalOpen(true);
          }}
          className="py-3 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inventory Stock</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{totalUnits} <span className="text-xs text-slate-400 font-normal">units</span></h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Fleet Asset Value</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">${totalFleetValue.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Out of Stock Alerts</p>
            <h3 className="text-3xl font-extrabold text-red-400 mt-1">{outOfStockCount} <span className="text-xs text-slate-400 font-normal">models</span></h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Car className="w-5 h-5 text-blue-400" />
            <span>Vehicle Fleet Inventory ({vehicles.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading inventory data...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No vehicles available in inventory. Click "Add New Vehicle" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      {v.make} <span className="text-blue-400">{v.model}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-white">
                      ${v.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200">
                      {v.quantity} units
                    </td>
                    <td className="px-6 py-4">
                      {v.quantity <= 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          Out of Stock
                        </span>
                      ) : v.quantity <= 2 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Restock Button */}
                        <button
                          onClick={() => {
                            setRestockingVehicle(v);
                            setIsRestockModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                          title="Restock Inventory"
                        >
                          <PackagePlus className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingVehicle(v);
                            setIsFormModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(v._id, v.make, v.model)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingVehicle}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        vehicle={restockingVehicle}
        onClose={() => setIsRestockModalOpen(false)}
        onRestock={handleRestock}
      />
    </div>
  );
};
