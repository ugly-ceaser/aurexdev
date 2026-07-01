'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Trash2, Save, X, Calendar, Activity, Sparkles, ShieldCheck, DollarSign } from 'lucide-react';

interface Package {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roiPercentage: number;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PackageForm {
  name: string;
  minAmount: string;
  maxAmount: string;
  roiPercentage: string;
  durationDays: string;
  isActive: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PackageForm>({
    name: '',
    minAmount: '',
    maxAmount: '',
    roiPercentage: '',
    durationDays: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      minAmount: '',
      maxAmount: '',
      roiPercentage: '',
      durationDays: '',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      name: pkg.name,
      minAmount: pkg.minAmount.toString(),
      maxAmount: pkg.maxAmount.toString(),
      roiPercentage: pkg.roiPercentage.toString(),
      durationDays: pkg.durationDays.toString(),
      isActive: pkg.isActive,
    });
    setEditingId(pkg._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const packageData = {
        name: formData.name,
        minAmount: parseFloat(formData.minAmount),
        maxAmount: parseFloat(formData.maxAmount),
        roiPercentage: parseFloat(formData.roiPercentage),
        durationDays: parseInt(formData.durationDays),
        isActive: formData.isActive,
      };

      const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingId ? 'Package updated successfully!' : 'Package created successfully!');
        fetchPackages();
        resetForm();
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Package deleted successfully!');
        fetchPackages();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete package');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setSuccess('Package status updated successfully!');
        fetchPackages();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update package status');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-[#7c3aed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-xs font-semibold text-gray-500">Querying platform yield tiers...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Yield Config</h1>
            <p className="text-sm font-light text-gray-500">Configure global active investment tiers, ROIs, and lockup parameters</p>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm} className="rounded-2xl bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] hover:opacity-90 text-white font-semibold shadow-md px-5 py-5 border-none h-11">
            <Plus className="h-4 w-4 mr-2 shrink-0" />
            Add Yield Tier
          </Button>
        </div>

        {/* Alerts */}
        {(error || success) && (
          <div className={`px-4 py-3 rounded-2xl text-xs font-semibold border ${
            error ? 'bg-red-500/10 border-red-500/30 text-rose-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
          }`}>
            {error || success}
          </div>
        )}

        {/* Package Form */}
        {showForm && (
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            <div className="mb-6">
              <h3 className="font-syne text-xl font-bold text-gray-900">{editingId ? 'Modify Yield Tier' : 'Deploy New Yield Tier'}</h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">Specify core metrics for algorithmic ROI appreciation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">Tier Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Starter, Elite"
                    className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roiPercentage" className="text-xs font-bold uppercase tracking-wider text-gray-400">Daily ROI (%)</Label>
                  <Input
                    id="roiPercentage"
                    type="number"
                    step="0.01"
                    value={formData.roiPercentage}
                    onChange={(e) => setFormData({ ...formData, roiPercentage: e.target.value })}
                    placeholder="e.g., 2.5"
                    className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationDays" className="text-xs font-bold uppercase tracking-wider text-gray-400">Lockup Duration (Days)</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    placeholder="e.g., 30"
                    className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minAmount" className="text-xs font-bold uppercase tracking-wider text-gray-400">Minimum Principal ($)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    placeholder="e.g., 100"
                    className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAmount" className="text-xs font-bold uppercase tracking-wider text-gray-400">Maximum Principal ($)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    placeholder="e.g., 10000"
                    className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive" className="text-xs font-bold uppercase tracking-wider text-gray-400">Active State</Label>
                  <select
                    id="isActive"
                    value={formData.isActive.toString()}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full p-3 rounded-2xl bg-white border border-purple-100 text-gray-700 text-sm focus:ring-purple-200 outline-none h-11"
                  >
                    <option value="true">Active state</option>
                    <option value="false">Inactive state</option>
                  </select>
                </div>

              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="rounded-xl bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] hover:opacity-90 text-white font-semibold px-6 py-5 border-none h-11">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update Tier' : 'Deploy Yield Tier'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl border-purple-100 hover:bg-gray-50 h-11">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* List of active packages */}
        <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-syne text-xl font-bold text-gray-900">Configured Yield Tiers</h3>
            <ShieldCheck className="h-5 w-5 text-[#7c3aed]" />
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-light">
              No active yield tiers registered currently. Create one to begin.
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div 
                  key={pkg._id}
                  className="p-4 rounded-2xl bg-white/70 border border-purple-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-syne font-bold text-sm text-gray-800">{pkg.name}</span>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="font-syne text-xs font-bold text-[#7c3aed]">{pkg.roiPercentage}% daily ROI</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 font-light">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 shrink-0" />
                        {formatCurrency(pkg.minAmount)} - {formatCurrency(pkg.maxAmount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {pkg.durationDays} Days lockup
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Badge
                      className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full cursor-pointer ${
                        pkg.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-150 text-gray-500'
                      }`}
                      onClick={() => toggleStatus(pkg._id, pkg.isActive)}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </Badge>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="bg-white hover:bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-xl h-8 px-2.5 shadow-sm"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl h-8 px-2.5"
                        onClick={() => handleDelete(pkg._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}