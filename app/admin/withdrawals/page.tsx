'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, Clock, CheckCircle2, AlertCircle, Calendar, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Withdrawal {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  userId: { name: string; email: string };
}

export default function AdminWithdrawalsPage() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/withdrawals");
    const data = await res.json();
    setWithdrawals(data);
    setLoading(false);
  };

  const handleStatus = async (
    withdrawalId: string,
    status: "approved" | "declined"
  ) => {
    setActionLoading(withdrawalId);
    setError("");
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, status }),
      });
      if (!res.ok) throw new Error("Failed to update withdrawal");
      setSuccessMessage(`Withdrawal ${status} successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchWithdrawals();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (withdrawalId: string) => {
    if (!confirm("Are you sure you want to cancel this withdrawal?")) return;
    
    setActionLoading(withdrawalId);
    setError("");
    try {
      const res = await fetch(`/api/admin/withdrawals?withdrawalId=${withdrawalId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel withdrawal");
      }
      setSuccessMessage("Withdrawal cancelled successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchWithdrawals();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate stats
  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === "pending").length,
    approved: withdrawals.filter((w) => w.status === "approved").length,
    declined: withdrawals.filter((w) => w.status === "declined").length,
    totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
  };

  // Filter withdrawals
  const filteredWithdrawals = filterStatus
    ? withdrawals.filter((w) => w.status === filterStatus)
    : withdrawals;

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Manage Withdrawals</h1>
          <p className="text-sm font-light text-gray-500">Audit, authorize, or reject investor balance withdrawal settlements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { t: 'Total Requests', v: stats.total, color: 'text-gray-700 bg-white border-purple-50' },
            { t: 'Pending', v: stats.pending, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { t: 'Approved', v: stats.approved, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { t: 'Declined', v: stats.declined, color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { t: 'Total Settlement Volume', v: `$${stats.totalAmount.toLocaleString()}`, color: 'text-purple-600 bg-purple-50 border-purple-100' }
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

        {/* Filter */}
        <div className="flex justify-between items-center">
          <select
            className="border border-purple-100 rounded-2xl px-4 py-2 bg-white text-gray-700 text-xs font-semibold focus-visible:ring-purple-200 outline-none shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {/* Table Ledger */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#7c3aed]" />
            <span className="text-xs font-semibold text-gray-500">Querying withdrawal ledger...</span>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="glass-panel rounded-[28px] p-12 text-center text-gray-400 font-light border border-purple-50">
            No withdrawal settlements found.
          </div>
        ) : (
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-400 border-b border-purple-50/60 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3">Investor</th>
                    <th>Email Address</th>
                    <th>Requested Payout</th>
                    <th>State</th>
                    <th>Timestamp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-gray-700">
                  {filteredWithdrawals.map((w) => (
                    <tr key={w._id} className="border-b border-purple-50/50 hover:bg-purple-50/10 transition-colors">
                      <td className="py-4 font-bold text-gray-800">{w.userId?.name || "-"}</td>
                      <td className="text-gray-400 font-light font-mono">{w.userId?.email || "-"}</td>
                      <td className="font-syne font-extrabold text-[#0f0e0d]">${w.amount.toLocaleString()}</td>
                      <td>
                        <Badge
                          className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                            w.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : w.status === "declined"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {w.status}
                        </Badge>
                      </td>
                      <td className="text-gray-400 font-light text-[10px]">{new Date(w.createdAt).toLocaleString()}</td>
                      <td>
                        <div className="flex gap-1.5">
                          {w.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold px-3 shadow-sm border-none h-8"
                                disabled={actionLoading === w._id}
                                onClick={() => handleStatus(w._id, "approved")}
                              >
                                {actionLoading === w._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold px-3 shadow-sm border-none h-8"
                                disabled={actionLoading === w._id}
                                onClick={() => handleStatus(w._id, "declined")}
                              >
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[10px] font-bold px-3 h-8"
                                disabled={actionLoading === w._id}
                                onClick={() => handleCancel(w._id)}
                              >
                                {actionLoading === w._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 shrink-0" />}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredWithdrawals.map((w) => (
                <div
                  key={w._id}
                  className="p-4 rounded-2xl bg-white/70 border border-purple-50/60 flex flex-col space-y-2 text-left"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 text-sm">{w.userId?.name || "-"}</h4>
                    <Badge
                      className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                        w.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : w.status === "declined"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {w.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-400 font-light font-mono">{w.userId?.email || ""}</p>
                  <div className="h-[1px] bg-purple-50/50 my-1" />
                  <div className="text-xs text-gray-600 font-semibold">
                    Amount: <strong className="text-gray-850">${w.amount.toLocaleString()}</strong>
                  </div>
                  <p className="text-[10px] text-gray-450 font-light flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    {new Date(w.createdAt).toLocaleString()}
                  </p>

                  {w.status === "pending" && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-purple-50">
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold py-4 px-4 border-none flex-1"
                        disabled={actionLoading === w._id}
                        onClick={() => handleStatus(w._id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold py-4 px-4 border-none flex-1"
                        disabled={actionLoading === w._id}
                        onClick={() => handleStatus(w._id, "declined")}
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
