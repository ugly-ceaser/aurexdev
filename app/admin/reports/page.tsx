'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, TrendingUp, AlertCircle, CheckCircle2, Loader2, Trash2, CreditCard, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Package {
  _id: string;
  name: string;
}

interface ReportData {
  totalProfits: number;
  roiPayouts: number;
  activePackages: Package[];
}

export default function AdminReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ userId: '', amount: '', description: '', packageId: '', transactionHash: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/reports');
    const data = await res.json();
    setReport(data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: form.userId, amount: form.amount, description: form.description }),
      });
      if (!res.ok) throw new Error('Failed to credit profit');
      setSuccess('Profit credited successfully');
      setForm({ ...form, amount: '', description: '' });
      await fetchReport();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: form.userId, amount: form.amount, packageId: form.packageId, transactionHash: form.transactionHash }),
      });
      if (!res.ok) throw new Error('Failed to deposit for investor');
      setSuccess('Deposit credited successfully');
      setForm({ ...form, amount: '', packageId: '', transactionHash: '' });
      await fetchReport();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInvestor = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: form.userId }),
      });
      if (!res.ok) throw new Error('Failed to delete investor');
      setSuccess('Investor and all transactions deleted');
      setForm({ userId: '', amount: '', description: '', packageId: '', transactionHash: '' });
      await fetchReport();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#7c3aed]" />
            <span className="text-xs font-semibold text-gray-500">Querying reports...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left max-w-4xl mx-auto">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Reports & Actions</h1>
          <p className="text-sm font-light text-gray-500">Directly execute adjustments, manual principal credits, and user telemetry purges</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/30 text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-[24px] p-6 border border-purple-50 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Profits issued</span>
            <p className="font-syne text-2xl font-bold text-gray-900">{report?.totalProfits ?? 0}</p>
          </div>
          <div className="glass-panel rounded-[24px] p-6 border border-purple-50 shadow-sm">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block mb-1">ROI payout cycles</span>
            <p className="font-syne text-2xl font-bold text-purple-600">{report?.roiPayouts ?? 0}</p>
          </div>
          <div className="glass-panel rounded-[24px] p-6 border border-purple-50 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Active yield tiers</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {report?.activePackages.map(pkg => (
                <Badge key={pkg._id} className="bg-purple-50 text-[#7c3aed] border-none font-bold text-[9px] px-2 rounded-full py-0.5">
                  {pkg.name}
                </Badge>
              )) || <span className="text-xs text-gray-400 italic">None</span>}
            </div>
          </div>
        </div>

        {/* Action Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form: Profit */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            <h3 className="font-syne text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#7c3aed]" />
              Credit Profit Payout
            </h3>

            <form onSubmit={handleProfit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="profitUserId" className="text-xs font-bold uppercase tracking-wider text-gray-400">Investor User ID</Label>
                <Input name="userId" id="profitUserId" value={form.userId} onChange={handleChange} placeholder="Paste MongoID..." className="rounded-2xl border-purple-100 bg-white" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="profitAmount" className="text-xs font-bold uppercase tracking-wider text-gray-400">USD Profit Amount</Label>
                <Input name="amount" id="profitAmount" type="number" value={form.amount} onChange={handleChange} placeholder="0.00" className="rounded-2xl border-purple-100 bg-white" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="profitDesc" className="text-xs font-bold uppercase tracking-wider text-gray-400">Ledger Description</Label>
                <Input name="description" id="profitDesc" value={form.description} onChange={handleChange} placeholder="e.g., Daily yield credit" className="rounded-2xl border-purple-100 bg-white" />
              </div>
              <Button type="submit" className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg" disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Post Profit Settlement'}
              </Button>
            </form>
          </div>

          {/* Form: Deposit */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            <h3 className="font-syne text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#7c3aed]" />
              Deploy Principal Deposit
            </h3>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="depUserId" className="text-xs font-bold uppercase tracking-wider text-gray-400">Investor User ID</Label>
                <Input name="userId" id="depUserId" value={form.userId} onChange={handleChange} placeholder="Paste MongoID..." className="rounded-2xl border-purple-100 bg-white" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="depAmount" className="text-xs font-bold uppercase tracking-wider text-gray-400">Principal Amount (USD)</Label>
                <Input name="amount" id="depAmount" type="number" value={form.amount} onChange={handleChange} placeholder="0.00" className="rounded-2xl border-purple-100 bg-white" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="depPkgId" className="text-xs font-bold uppercase tracking-wider text-gray-400">Package ID</Label>
                <Input name="packageId" id="depPkgId" value={form.packageId} onChange={handleChange} placeholder="Paste Package MongoID..." className="rounded-2xl border-purple-100 bg-white" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="depTxHash" className="text-xs font-bold uppercase tracking-wider text-gray-400">Transaction ID (TxHash)</Label>
                <Input name="transactionHash" id="depTxHash" value={form.transactionHash} onChange={handleChange} placeholder="Paste Blockchain TxID..." className="rounded-2xl border-purple-100 bg-white font-mono text-xs" required />
              </div>
              <Button type="submit" className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg" disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Deploy Deposit'}
              </Button>
            </form>
          </div>

        </div>

        {/* Purge Investor */}
        <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 border-rose-100/50 bg-rose-50/5">
          <h3 className="font-syne text-xl font-bold text-rose-700 mb-2 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-rose-500" />
            Purge Account Telemetry
          </h3>
          <p className="text-xs text-gray-400 font-light mb-6">Permanently deletes selected investor credentials, portfolios, payments, and histories from all active databanks.</p>

          <form onSubmit={handleDeleteInvestor} className="flex flex-col sm:flex-row gap-3">
            <Input name="userId" value={form.userId} onChange={handleChange} placeholder="Investor MongoID..." className="rounded-2xl border-rose-100 bg-white py-6 pl-4 text-sm focus-visible:ring-rose-200 flex-1 font-mono text-xs" required />
            <Button type="submit" variant="destructive" className="rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-md px-8 py-6 border-none" disabled={actionLoading}>
              {actionLoading ? 'Purging...' : 'Purge Investor Data'}
            </Button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
