'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Wallet, 
  Mail, 
  Plus, 
  DollarSign, 
  Activity, 
  Settings, 
  Sparkles,
  Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AdminStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  totalUsers: number;
}

export default function AdminDashboardPage() {
  const [depositWallet, setDepositWallet] = useState<string>('');
  const [depositCoin, setDepositCoin] = useState<string>('USDT');
  const [depositNetwork, setDepositNetwork] = useState<string>('TRC20');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ _id: string; name: string; email: string; balance: number }[]>([]);
  const [packages, setPackages] = useState<{ _id: string; name: string; minAmount: number; maxAmount: number; roiPercentage: number }[]>([]);
  const [deposits, setDeposits] = useState<{ _id: string; userId: any; packageId: any; amount: number; status: string; createdAt: string }[]>([]);
  const [selectedProfitUserId, setSelectedProfitUserId] = useState<string>('');
  const [selectedProfitPackageId, setSelectedProfitPackageId] = useState<string>('');
  const [selectedDepositId, setSelectedDepositId] = useState<string>('');
  const [profitAmount, setProfitAmount] = useState<string>('');
  const [updateBalance, setUpdateBalance] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Get users with active investments (approved deposits)
  const usersWithActiveInvestments = users.filter(user => 
    deposits.some(deposit => 
      deposit.userId?._id === user._id && 
      deposit.status === 'approved'
    )
  );

  useEffect(() => {
    // Fetch deposit wallet address, coin type, and network uploaded by admin
    fetch('/api/admin/deposit-wallet')
      .then(res => res.json())
      .then(data => {
        setDepositWallet(data.address || '');
        setDepositCoin(data.coinType || 'USDT');
        setDepositNetwork(data.network || 'TRC20');
      });
    // Fetch all deposits for dropdown
    fetch('/api/admin/deposits')
      .then(res => res.json())
      .then(data => setDeposits(data));
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Fetch users for dropdowns
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));
    // Fetch active packages for deposit dropdown
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => setPackages(data));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Admin Dashboard</h1>
            <p className="text-sm font-light text-gray-500">Configure global configurations, broadcast updates, and audit transactions</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-purple-100 rounded-full text-xs font-semibold text-[#7c3aed] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#4169e1] to-[#e040fb] animate-pulse" />
            Global Operator Active
          </div>
        </div>

        {/* Deposit Funding Configuration */}
        <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-syne text-lg font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#7c3aed]" />
              Deposit Funding Configuration
            </h2>
            <Badge className="bg-purple-50 text-[#7c3aed] font-semibold border-none rounded-full px-3">Primary Payout Gateway</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 border border-purple-50/50 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Vault Address</span>
              <span className="font-mono text-gray-800 lowercase block text-sm font-bold truncate select-all">{depositWallet || 'Not set'}</span>
            </div>
            <div className="bg-gray-50 border border-purple-50/50 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Coin Type</span>
              <span className="font-syne text-gray-800 block text-sm font-bold select-all">{depositCoin || 'USDT'}</span>
            </div>
            <div className="bg-gray-50 border border-purple-50/50 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Transfer Network</span>
              <span className="font-syne text-gray-800 block text-sm font-bold select-all">{depositNetwork || 'TRC20'}</span>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setActionLoading('wallet');
              setActionSuccess(null);
              setActionError(null);
              const form = e.target as HTMLFormElement;
              const address = (form.elements.namedItem('walletAddress') as HTMLInputElement).value;
              const coinType = (form.elements.namedItem('coinType') as HTMLInputElement).value;
              const network = (form.elements.namedItem('network') as HTMLInputElement).value;
              try {
                const res = await fetch('/api/admin/deposit-wallet', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ address, coinType, network }),
                });
                if (!res.ok) throw new Error('Failed to update deposit settings');
                const data = await res.json();
                setDepositWallet(data.address);
                setDepositCoin(data.coinType);
                setDepositNetwork(data.network);
                setActionSuccess('Deposit settings updated successfully!');
                setTimeout(() => setActionSuccess(null), 3000);
              } catch (err: any) {
                setActionError(err.message || 'Error occurred');
                setTimeout(() => setActionError(null), 3000);
              } finally {
                setActionLoading(null);
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 text-left">
                <Label htmlFor="walletAddress" className="text-xs font-bold uppercase tracking-wider text-gray-400">Vault Address</Label>
                <Input id="walletAddress" name="walletAddress" type="text" placeholder="Enter wallet address..." defaultValue={depositWallet} className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200" required />
              </div>
              <div className="space-y-1 text-left">
                <Label htmlFor="coinType" className="text-xs font-bold uppercase tracking-wider text-gray-400">Coin Type</Label>
                <select 
                  id="coinType" 
                  name="coinType" 
                  value={depositCoin}
                  onChange={(e) => setDepositCoin(e.target.value)}
                  className="w-full rounded-2xl border border-purple-100 bg-white/50 py-3.5 px-4 text-sm focus-visible:ring-purple-200 outline-none text-gray-700 font-semibold"
                  required
                >
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
              <div className="space-y-1 text-left">
                <Label htmlFor="network" className="text-xs font-bold uppercase tracking-wider text-gray-400">Transfer Network</Label>
                <select 
                  id="network" 
                  name="network" 
                  value={depositNetwork}
                  onChange={(e) => setDepositNetwork(e.target.value)}
                  className="w-full rounded-2xl border border-purple-100 bg-white/50 py-3.5 px-4 text-sm focus-visible:ring-purple-200 outline-none text-gray-700 font-semibold"
                  required
                >
                  <option value="TRC20">TRC20 (Tron)</option>
                  <option value="ERC20">ERC20 (Ethereum)</option>
                  <option value="BEP20">BEP20 (BSC)</option>
                  <option value="Bitcoin">Bitcoin (Native)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" className="rounded-2xl bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] hover:opacity-90 text-white font-semibold shadow-md px-8 py-5 border-none" disabled={actionLoading === 'wallet'}>
                {actionLoading === 'wallet' ? 'Saving...' : 'Update Settings'}
              </Button>
            </div>
          </form>
          {actionSuccess && <div className="text-emerald-600 text-xs font-bold mt-2">✓ {actionSuccess}</div>}
          {actionError && <div className="text-rose-600 text-xs font-bold mt-2">✗ {actionError}</div>}
        </div>

        {/* Global Statistics */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <svg className="animate-spin h-6 w-6 text-[#7c3aed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-xs font-semibold text-gray-500">Querying platform stats...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: 'Total Deposits', v: formatCurrency(stats?.totalDeposits ?? 0), i: TrendingUp, color: 'text-blue-500 bg-blue-50 border-blue-100' },
              { t: 'Total Withdrawals', v: formatCurrency(stats?.totalWithdrawals ?? 0), i: TrendingDown, color: 'text-rose-500 bg-rose-50 border-rose-100' },
              { t: 'Total Profits Issued', v: formatCurrency(stats?.totalProfits ?? 0), i: Sparkles, color: 'text-purple-500 bg-purple-50 border-purple-100' },
              { t: 'Total Registered Users', v: stats?.totalUsers ?? 0, i: Users, color: 'text-amber-500 bg-amber-50 border-amber-100' }
            ].map((stat, idx) => {
              const Icon = stat.i;
              return (
                <div key={idx} className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{stat.t}</span>
                    <p className="font-syne font-bold text-2xl text-gray-800">{stat.v}</p>
                  </div>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add User Profit */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col justify-between">
            <div>
              <h2 className="font-syne text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#7c3aed]" />
                Add User Profit
              </h2>
              
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setActionLoading('profit');
                  setActionSuccess(null);
                  setActionError(null);
                  
                  if (!selectedProfitUserId || !profitAmount || !selectedDepositId) {
                    setActionError('Please fill all required fields');
                    setActionLoading(null);
                    return;
                  }

                  try {
                    const res = await fetch('/api/admin/profit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        userId: selectedProfitUserId, 
                        amount: profitAmount, 
                        packageId: selectedProfitPackageId, 
                        depositId: selectedDepositId,
                        updateBalance 
                      }),
                    });
                    
                    const data = await res.json();
                    
                    if (!res.ok) {
                      throw new Error(data.error || 'Failed to add profit');
                    }
                    
                    if (updateBalance && data.newBalance !== undefined) {
                      setUsers(users.map(u => 
                        u._id === selectedProfitUserId 
                          ? { ...u, balance: data.newBalance }
                          : u
                      ));
                    }
                    
                    setSelectedProfitUserId('');
                    setSelectedProfitPackageId('');
                    setSelectedDepositId('');
                    setProfitAmount('');
                    setUpdateBalance(true);
                    
                    setActionSuccess(data.message || 'Profit added successfully!');
                    setTimeout(() => setActionSuccess(null), 5000);
                  } catch (err: any) {
                    setActionError(err.message || 'Error occurred');
                    setTimeout(() => setActionError(null), 5000);
                  } finally {
                    setActionLoading(null);
                  }
                }}
              >
                {/* User Selection */}
                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Select Active Investor *
                  </Label>
                  <select
                    name="profitUserId"
                    className="w-full p-3 rounded-2xl bg-white border border-purple-100 text-gray-700 text-sm focus:ring-purple-200 outline-none"
                    required
                    value={selectedProfitUserId}
                    onChange={e => {
                      setSelectedProfitUserId(e.target.value);
                      setSelectedDepositId('');
                      setSelectedProfitPackageId('');
                      setProfitAmount('');
                    }}
                  >
                    <option value="">-- Select Investor --</option>
                    {usersWithActiveInvestments.map(u => {
                      const userDeposits = deposits.filter(d => d.userId?._id === u._id && d.status === 'approved');
                      const totalInvested = userDeposits.reduce((sum, d) => sum + d.amount, 0);
                      return (
                        <option key={u._id} value={u._id}>
                          {u.name} (Bal: ${u.balance?.toFixed(2) || '0.00'})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Deposit Selection */}
                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Select Approved Deposit *
                  </Label>
                  <select 
                    name="profitDepositId" 
                    className="w-full p-3 rounded-2xl bg-white border border-purple-100 text-gray-700 text-sm focus:ring-purple-200 outline-none"
                    required
                    value={selectedDepositId}
                    onChange={e => {
                      const depositId = e.target.value;
                      setSelectedDepositId(depositId);
                      
                      if (depositId) {
                        const deposit = deposits.find(d => d._id === depositId);
                        if (deposit && deposit.packageId) {
                          setSelectedProfitPackageId(deposit.packageId._id);
                          const pkg = packages.find(p => p._id === deposit.packageId._id);
                          if (pkg) {
                            const calculatedProfit = (deposit.amount * pkg.roiPercentage) / 100;
                            setProfitAmount(calculatedProfit.toFixed(2));
                          }
                        }
                      } else {
                        setSelectedProfitPackageId('');
                        setProfitAmount('');
                      }
                    }}
                  >
                    <option value="">-- Select Deposit --</option>
                    {deposits
                      .filter(dep =>
                        dep.status === 'approved' &&
                        (!selectedProfitUserId || dep.userId?._id === selectedProfitUserId)
                      )
                      .map(dep => (
                        <option key={dep._id} value={dep._id}>
                          ${dep.amount} on {dep.packageId?.name || 'N/A'} - {new Date(dep.createdAt).toLocaleDateString()}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Display Selected Package Info */}
                {selectedDepositId && selectedProfitPackageId && (
                  <div className="bg-[#f8f7f5] p-3 rounded-2xl border border-purple-50 text-xs font-semibold text-gray-500">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Yield Tier</span>
                    <div className="text-gray-800">
                      {packages.find(p => p._id === selectedProfitPackageId)?.name} 
                      <Badge className="bg-purple-50 text-[#7c3aed] ml-2 border-none rounded-full px-2 py-0.5">
                        {packages.find(p => p._id === selectedProfitPackageId)?.roiPercentage}% Daily ROI
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Profit Amount */}
                <div className="space-y-1 text-left">
                  <Label htmlFor="profitAmount" className="text-xs font-bold uppercase tracking-wider text-gray-400">Profit Amount (USD) *</Label>
                  <Input 
                    id="profitAmount"
                    name="profitAmount" 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    placeholder="Enter yield payout..." 
                    className="rounded-2xl border-purple-100 bg-white py-4 px-4 text-sm focus-visible:ring-purple-200" 
                    required
                    value={profitAmount}
                    onChange={e => setProfitAmount(e.target.value)}
                  />
                </div>

                {/* Update Balance Toggle */}
                <div className="flex items-center space-x-2.5 pt-1 text-left">
                  <input 
                    type="checkbox" 
                    id="updateBalance"
                    checked={updateBalance}
                    onChange={e => setUpdateBalance(e.target.checked)}
                    className="w-4 h-4 text-[#7c3aed] border-purple-100 rounded focus:ring-purple-200 cursor-pointer"
                  />
                  <Label htmlFor="updateBalance" className="text-xs font-bold uppercase tracking-wider text-gray-400 cursor-pointer">
                    Update user ledger balance
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95" 
                  disabled={actionLoading === 'profit' || !selectedProfitUserId || !selectedDepositId || !profitAmount}
                >
                  {actionLoading === 'profit' ? 'Executing...' : 'Post Profit Yield'}
                </Button>
                
                {actionSuccess && <div className="text-emerald-600 text-xs font-bold mt-2">✓ {actionSuccess}</div>}
                {actionError && <div className="text-rose-600 text-xs font-bold mt-2">✗ {actionError}</div>}
              </form>
            </div>
          </div>

          {/* Deposit for User */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col justify-between">
            <div>
              <h2 className="font-syne text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#7c3aed]" />
                Direct User Deposit
              </h2>
              
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setActionLoading('deposit');
                  setActionSuccess(null);
                  setActionError(null);
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('depositEmail') as HTMLSelectElement).value;
                  const amount = (form.elements.namedItem('depositAmount') as HTMLInputElement).value;
                  const packageId = (form.elements.namedItem('depositPackage') as HTMLSelectElement).value;
                  try {
                    const res = await fetch('/api/admin/deposit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, amount, packageId }),
                    });
                    if (!res.ok) throw new Error('Failed to create deposit');
                    form.reset();
                    setActionSuccess('Deposit successfully logged!');
                    setTimeout(() => setActionSuccess(null), 3000);
                  } catch (err: any) {
                    setActionError(err.message || 'Error occurred');
                    setTimeout(() => setActionError(null), 3000);
                  } finally {
                    setActionLoading(null);
                  }
                }}
              >
                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Target User</Label>
                  <select name="depositEmail" className="w-full p-3 rounded-2xl bg-white border border-purple-100 text-gray-700 text-sm focus:ring-purple-200 outline-none" required>
                    <option value="">Select User</option>
                    {users.map(u => (
                      <option key={u._id} value={u.email}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Principal Deposit Amount</Label>
                  <Input name="depositAmount" type="number" placeholder="USD amount..." className="rounded-2xl border-purple-100 bg-white py-4 px-4 text-sm focus-visible:ring-purple-200" required />
                </div>

                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Yield Tier allocation</Label>
                  <select name="depositPackage" className="w-full p-3 rounded-2xl bg-white border border-purple-100 text-gray-700 text-sm focus:ring-purple-200 outline-none" required>
                    <option value="">Select Package</option>
                    {packages.map(pkg => (
                      <option key={pkg._id} value={pkg._id}>{pkg.name} ({pkg.roiPercentage}% daily)</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95" disabled={actionLoading === 'deposit'}>
                  {actionLoading === 'deposit' ? 'Processing...' : 'Log Manual Deposit'}
                </Button>
                {actionSuccess && <div className="text-emerald-600 text-xs font-bold mt-2">✓ {actionSuccess}</div>}
                {actionError && <div className="text-rose-600 text-xs font-bold mt-2">✗ {actionError}</div>}
              </form>
            </div>
          </div>

          {/* Send Broadcast Mail */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col justify-between">
            <div>
              <h2 className="font-syne text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#7c3aed]" />
                User Notification
              </h2>
              
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setActionLoading('mail');
                  setActionSuccess(null);
                  setActionError(null);
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('mailEmail') as HTMLSelectElement).value;
                  const subject = (form.elements.namedItem('mailSubject') as HTMLInputElement).value;
                  const message = (form.elements.namedItem('mailMessage') as HTMLTextAreaElement).value;
                  try {
                    const res = await fetch('/api/admin/mail', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, subject, message }),
                    });
                    if (!res.ok) throw new Error('Failed to send email');
                    form.reset();
                    setActionSuccess('Message successfully sent!');
                    setTimeout(() => setActionSuccess(null), 3000);
                  } catch (err: any) {
                    setActionError(err.message || 'Error occurred');
                    setTimeout(() => setActionError(null), 3000);
                  } finally {
                    setActionLoading(null);
                  }
                }}
              >
                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">User Recipient</Label>
                  <select name="mailEmail" className="w-full p-3 rounded-2xl bg-white border border-purple-100 text-gray-700 text-sm focus:ring-purple-200 outline-none" required>
                    <option value="">Select User</option>
                    {users.map(u => (
                      <option key={u._id} value={u.email}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Subject</Label>
                  <Input name="mailSubject" type="text" placeholder="Title/Subject..." className="rounded-2xl border-purple-100 bg-white py-4 px-4 text-sm focus-visible:ring-purple-200" required />
                </div>

                <div className="space-y-1 text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Message Content</Label>
                  <textarea name="mailMessage" placeholder="Type notification message..." className="w-full min-h-[80px] p-4 rounded-2xl bg-white border border-purple-100 text-gray-700 text-sm focus:ring-purple-200 outline-none" required />
                </div>

                <Button type="submit" className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95" disabled={actionLoading === 'mail'}>
                  {actionLoading === 'mail' ? 'Sending...' : 'Dispatch Notification'}
                </Button>
                {actionSuccess && <div className="text-emerald-600 text-xs font-bold mt-2">✓ {actionSuccess}</div>}
                {actionError && <div className="text-rose-600 text-xs font-bold mt-2">✗ {actionError}</div>}
              </form>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
