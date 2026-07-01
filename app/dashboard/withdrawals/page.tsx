'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, DollarSign, Clock, CheckCircle, Sparkles, Calendar, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Withdrawal {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "declined";
  createdAt: string;
}

export default function WithdrawalsPage() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [balance, setBalance] = useState(0);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileWallet, setProfileWallet] = useState("");
  const [profileCoin, setProfileCoin] = useState("");
  const [profileNetwork, setProfileNetwork] = useState("");
  const [newWallet, setNewWallet] = useState("");
  const [newCoin, setNewCoin] = useState("");
  const [newNetwork, setNewNetwork] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [withdrawalsRes, profileRes] = await Promise.all([
        fetch("/api/withdrawals"),
        fetch("/api/profile")
      ]);
      
      if (withdrawalsRes.ok) setWithdrawals(await withdrawalsRes.json());
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setBalance(profileData.balance || 0);
        setProfileWallet(profileData.walletAddress || "");
        setProfileCoin(profileData.coinType || "");
        setProfileNetwork(profileData.transferNetwork || "");
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    const withdrawAmount = Number(amount);
    
    if (withdrawAmount <= 0) {
      setError("Amount must be greater than 0");
      setLoading(false);
      return;
    }
    
    if (withdrawAmount > balance) {
      setError("Insufficient balance");
      setLoading(false);
      return;
    }
    
    const needsPayoutSetup = !(profileWallet && profileCoin && profileNetwork);
    if (needsPayoutSetup && (!newWallet || !newCoin || !newNetwork)) {
      setError("Please complete your payout setup details");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: withdrawAmount,
          ...(needsPayoutSetup ? {
            walletAddress: newWallet,
            coinType: newCoin,
            transferNetwork: newNetwork
          } : {})
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to request withdrawal");
      }
      
      const newWithdrawal = await res.json();
      setWithdrawals([newWithdrawal, ...withdrawals]);
      setAmount("");
      setSuccess("Withdrawal request submitted successfully! Processing time: 24-48 hours.");
      setTimeout(() => setSuccess(""), 5000);
      fetchData(); // Refresh balance
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesStatus = filterStatus ? w.status === filterStatus : true;
    const matchesSearch = search
      ? w.status.toLowerCase().includes(search.toLowerCase()) ||
        w.amount.toString().includes(search)
      : true;
    return matchesStatus && matchesSearch;
  });

  const paginatedWithdrawals = filteredWithdrawals.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredWithdrawals.length / pageSize) || 1;

  // Calculate stats
  const totalApprovedAmount = withdrawals
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const pendingAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Withdraw Funds</h1>
          <p className="text-sm font-light text-gray-500">Easily liquidate accrued yields directly to your registered wallet</p>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-tr from-purple-100/30 to-pink-100/20 border border-purple-100 rounded-[28px] p-6 shadow-sm">
          <h2 className="font-syne text-lg font-bold text-[#7c3aed] mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#e040fb]" />
            Telemetry Withdrawal Guidelines
          </h2>
          <ol className="list-decimal ml-6 text-sm text-gray-600 space-y-1.5 font-light">
            <li>Ensure your available balance exceeds your target withdrawal amount.</li>
            <li>Define the USD amount you want to liquidate.</li>
            <li>Submit the withdrawal authorization request.</li>
            <li>Secured manual review will verify and finalize settlement within 24-48 hours.</li>
            <li>Payouts arrive directly at your profile registered payout address.</li>
          </ol>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Available balance</span>
            <p className="font-syne text-2xl font-bold text-emerald-600">${balance.toLocaleString()}</p>
          </div>
          <div className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Pending Amount</span>
            <p className="font-syne text-2xl font-bold text-amber-600">${pendingAmount.toLocaleString()}</p>
            <span className="text-[10px] text-gray-400 font-light block mt-0.5">{pendingCount} requests pending</span>
          </div>
          <div className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">Approved Payouts</span>
            <p className="font-syne text-2xl font-bold text-blue-600">${totalApprovedAmount.toLocaleString()}</p>
          </div>
          <div className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block mb-1">Total Requests</span>
            <p className="font-syne text-2xl font-bold text-purple-600">{withdrawals.length}</p>
          </div>
        </div>

        {/* Main Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Withdrawal Form */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            <h2 className="font-syne text-xl font-bold text-gray-900 mb-6">Initialize New Settlement</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount" className="text-xs font-bold uppercase tracking-wider text-gray-400">Withdrawal Amount (USD)</Label>
                <div className="relative flex items-center mt-1">
                  <span className="absolute left-4 font-bold text-gray-400">$</span>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={balance}
                    className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-8 pr-4 text-sm focus-visible:ring-purple-200"
                  />
                </div>
                
                {/* Fast pill selections */}
                <div className="flex gap-2 pt-1">
                  {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
                    const label = pct === 1 ? 'Max' : `${pct * 100}%`;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAmount((balance * pct).toFixed(2))}
                        className="px-3.5 py-1.5 border border-purple-100 rounded-xl text-xs font-bold bg-white hover:bg-purple-50 text-gray-600 transition-colors"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                
                {amount && Number(amount) > balance && (
                  <p className="text-xs text-rose-500 mt-1">
                    Insufficient balance. Available pool: ${balance.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Payout Destination Settings */}
              {(profileWallet && profileCoin && profileNetwork) ? (
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 space-y-2 text-xs font-semibold text-gray-600 text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Registered Payout Destination</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Coin Type</span>
                      <span className="text-gray-800 font-bold">{profileCoin}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Network</span>
                      <span className="text-[#7c3aed] font-bold">{profileNetwork}</span>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-purple-100/50">
                    <span className="text-[9px] text-gray-400 block uppercase">Address</span>
                    <span className="font-mono text-gray-800 break-all">{profileWallet}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-purple-50">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">Payout Setup Required</span>
                  <p className="text-[11px] text-gray-400 font-light -mt-2">You haven&apos;t fully configured your withdrawal payout credentials yet. Please supply them below to proceed:</p>
                  
                  <div className="space-y-2 text-left">
                    <Label htmlFor="newWallet" className="text-xs font-bold uppercase tracking-wider text-gray-400">Wallet Payout Address *</Label>
                    <Input
                      id="newWallet"
                      type="text"
                      value={newWallet}
                      onChange={(e) => setNewWallet(e.target.value)}
                      placeholder="Paste your destination wallet address..."
                      required
                      className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm focus-visible:ring-purple-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 text-left">
                      <Label htmlFor="newCoin" className="text-xs font-bold uppercase tracking-wider text-gray-400">Coin Type *</Label>
                      <select
                        id="newCoin"
                        value={newCoin}
                        onChange={(e) => setNewCoin(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-purple-100 bg-white/50 py-3.5 px-4 text-sm focus-visible:ring-purple-200 outline-none text-gray-700 font-semibold"
                      >
                        <option value="">Select Coin</option>
                        <option value="USDT">USDT</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>

                    <div className="space-y-2 text-left">
                      <Label htmlFor="newNetwork" className="text-xs font-bold uppercase tracking-wider text-gray-400">Network *</Label>
                      <select
                        id="newNetwork"
                        value={newNetwork}
                        onChange={(e) => setNewNetwork(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-purple-100 bg-white/50 py-3.5 px-4 text-sm focus-visible:ring-purple-200 outline-none text-gray-700 font-semibold"
                      >
                        <option value="">Select Network</option>
                        <option value="TRC20">TRC20 (Tron)</option>
                        <option value="ERC20">ERC20 (Ethereum)</option>
                        <option value="BEP20">BEP20 (BSC)</option>
                        <option value="Bitcoin">Bitcoin (Native)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              {amount && Number(amount) > 0 && Number(amount) <= balance && (
                <div className="bg-[#f8f7f5] border border-purple-50 rounded-2xl p-4 space-y-2 text-xs font-semibold text-gray-500">
                  <div className="flex justify-between">
                    <span>Target liquidation</span>
                    <span className="text-gray-800">${Number(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blockchain Telemetry Fee</span>
                    <span className="text-emerald-600">$0.00</span>
                  </div>
                  <div className="border-t border-purple-50 pt-2 flex justify-between items-center">
                    <span className="text-gray-800">Final Net Payout</span>
                    <span className="font-syne font-extrabold text-emerald-600 text-lg">${Number(amount).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/30 text-rose-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                  {success}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95 transition-opacity"
                disabled={!amount || Number(amount) <= 0 || Number(amount) > balance || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finalizing telemetry check...
                  </>
                ) : (
                  'Authorize Withdrawal Settlement'
                )}
              </Button>
            </form>
          </div>

          {/* Withdrawal History */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col justify-between">
            <div>
              <h2 className="font-syne text-xl font-bold text-gray-900 mb-6">Withdrawal History</h2>
              
              {/* Search/Filter block */}
              <div className="flex gap-2 mb-6">
                <Input
                  type="text"
                  placeholder="Search amounts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-xs focus-visible:ring-purple-200"
                />
                <select
                  className="border border-purple-100 rounded-2xl px-3 bg-white text-gray-700 text-xs font-medium focus-visible:ring-purple-200 outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All States</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Ledger list */}
              <div className="overflow-x-auto">
                {paginatedWithdrawals.length === 0 ? (
                  <div className="text-center text-gray-400 py-12 font-light">
                    No matching withdrawal records.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedWithdrawals.map((w) => (
                      <div 
                        key={w._id} 
                        className="p-4 rounded-2xl bg-white/70 border border-purple-50/50 flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-syne font-bold text-sm text-gray-800">
                              USDT Settlement
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-light">
                            <Calendar className="h-3 w-3" />
                            {new Date(w.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <p className="font-syne font-bold text-rose-600 text-sm">
                            -${w.amount.toLocaleString()}
                          </p>
                          <Badge
                            className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                              w.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : w.status === 'declined'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {w.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-purple-50 text-xs font-semibold text-gray-500">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-xl border-purple-50"
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="rounded-xl border-purple-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
