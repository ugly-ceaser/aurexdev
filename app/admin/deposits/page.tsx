'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2, TrendingUp, Clock, CheckCircle2, AlertCircle, ExternalLink, Calendar, Trash } from 'lucide-react';

interface Deposit {
  _id: string;
  amount: number;
  status: string;
  txHash: string;
  createdAt: string;
  userId: { _id: string; name: string; email: string };
  packageId: { _id: string; name: string };
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/deposits');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setDeposits(data);
    } catch (err: any) {
      console.error('Error fetching deposits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (depositId: string, status: 'approved' | 'declined') => {
    setActionLoading(depositId);
    setError('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId, status }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update deposit');
      
      setSuccessMessage(data.message || `Deposit ${status} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchDeposits();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (depositId: string) => {
    if (!confirm('Are you sure you want to cancel this deposit? This action cannot be undone.')) {
      return;
    }

    setActionLoading(depositId);
    setError('');
    setSuccessMessage('');
    try {
      const res = await fetch(`/api/admin/deposits?depositId=${depositId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel deposit');
      
      setSuccessMessage(data.message || 'Deposit cancelled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchDeposits();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDeposits = deposits.filter(dep => {
    if (filterStatus === 'all') return true;
    return dep.status === filterStatus;
  });

  const stats = {
    total: deposits.length,
    pending: deposits.filter(d => d.status === 'pending').length,
    approved: deposits.filter(d => d.status === 'approved').length,
    declined: deposits.filter(d => d.status === 'declined').length,
    totalAmount: deposits.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.amount, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Manage Deposits</h1>
          <p className="text-sm font-light text-gray-500">Audit, approve, or reject user digital asset principal funding requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { t: 'Total Deposits', v: stats.total, color: 'text-gray-700 bg-white border-purple-50' },
            { t: 'Pending', v: stats.pending, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { t: 'Approved', v: stats.approved, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { t: 'Declined', v: stats.declined, color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { t: 'Approved Amount', v: `$${stats.totalAmount.toLocaleString()}`, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
          ].map((card, idx) => (
            <div key={idx} className={`glass-panel rounded-[24px] p-5 border shadow-sm ${card.color}`}>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{card.t}</span>
              <p className="font-syne text-xl font-bold">{card.v}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/30 text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Ledger */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#7c3aed]" />
            <span className="text-xs font-semibold text-gray-500">Querying deposit transactions...</span>
          </div>
        ) : deposits.length === 0 ? (
          <div className="glass-panel rounded-[28px] p-12 text-center text-gray-400 font-light border border-purple-50">
            No deposits logged currently.
          </div>
        ) : (
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            
            {/* Filter selector */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Filter:</Label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-purple-100 rounded-2xl px-3 py-2 bg-white text-gray-700 text-xs font-semibold focus-visible:ring-purple-200 outline-none"
                >
                  <option value="all">All ({stats.total})</option>
                  <option value="pending">Pending ({stats.pending})</option>
                  <option value="approved">Approved ({stats.approved})</option>
                  <option value="declined">Declined ({stats.declined})</option>
                </select>
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Showing {filteredDeposits.length} of {deposits.length} deposits
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-400 border-b border-purple-50/60 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3">Investor</th>
                    <th>Yield Pool</th>
                    <th>Principal</th>
                    <th>TxHash</th>
                    <th>State</th>
                    <th>Timestamp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-gray-700">
                  {filteredDeposits.map((dep) => (
                    <tr key={dep._id} className="border-b border-purple-50/50 hover:bg-purple-50/10 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-gray-800">{dep.userId?.name || "-"}</div>
                        <div className="text-[10px] text-gray-400 font-light mt-0.5">{dep.userId?.email || ""}</div>
                      </td>
                      <td className="font-syne font-bold text-gray-800">{dep.packageId?.name || "-"}</td>
                      <td className="font-syne font-extrabold text-gray-800">${dep.amount?.toLocaleString() || 0}</td>
                      <td>
                        {dep.txHash ? (
                          <a
                            href={`https://etherscan.io/tx/${dep.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4169e1] hover:underline inline-flex items-center gap-1 font-mono text-[10px]"
                          >
                            {dep.txHash?.slice(0, 6)}...{dep.txHash?.slice(-4)}
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-gray-400 font-light">N/A</span>
                        )}
                      </td>
                      <td>
                        <Badge
                          className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                            dep.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : dep.status === "declined"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {dep.status}
                        </Badge>
                      </td>
                      <td className="text-gray-400 font-light text-[10px]">{new Date(dep.createdAt).toLocaleString()}</td>
                      <td>
                        {dep.status === "pending" ? (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold px-3 shadow-sm border-none h-8"
                              disabled={actionLoading === dep._id}
                              onClick={() => handleStatus(dep._id, "approved")}
                            >
                              {actionLoading === dep._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold px-3 shadow-sm border-none h-8"
                              disabled={actionLoading === dep._id}
                              onClick={() => handleStatus(dep._id, "declined")}
                            >
                              {actionLoading === dep._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Decline"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[10px] font-bold px-3 h-8"
                              disabled={actionLoading === dep._id}
                              onClick={() => handleCancel(dep._id)}
                            >
                              {actionLoading === dep._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash className="h-3.5 w-3.5 shrink-0" />}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {dep.status === "approved" ? "✓ Settled" : "✗ Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredDeposits.map((dep) => (
                <div
                  key={dep._id}
                  className="p-4 rounded-2xl bg-white/70 border border-purple-50/60 flex flex-col space-y-2 text-left"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 text-sm">{dep.userId?.name || "-"}</h4>
                    <Badge
                      className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                        dep.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : dep.status === "declined"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {dep.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-400 font-light">{dep.userId?.email || ""}</p>
                  <div className="h-[1px] bg-purple-50/50 my-1" />
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 font-semibold">
                    <div>Pool: <strong className="text-gray-800">{dep.packageId?.name || "-"}</strong></div>
                    <div>Amount: <strong className="text-gray-850">${dep.amount?.toLocaleString() || 0}</strong></div>
                  </div>
                  <p className="text-[10px] text-gray-450 font-light flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    {new Date(dep.createdAt).toLocaleString()}
                  </p>

                  {dep.status === "pending" && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-purple-50">
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold py-4 px-4 border-none flex-1"
                        disabled={actionLoading === dep._id}
                        onClick={() => handleStatus(dep._id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold py-4 px-4 border-none flex-1"
                        disabled={actionLoading === dep._id}
                        onClick={() => handleStatus(dep._id, "declined")}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
