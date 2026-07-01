'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Copy, ExternalLink, Loader2, AlertCircle, Sparkles, CheckCircle2, TrendingUp, Clock, Calendar, Check } from 'lucide-react';

interface Package {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roiPercentage: number;
}

interface Deposit {
  _id: string;
  packageId: Package;
  amount: number;
  txHash: string;
  status: string;
  createdAt: string;
}

export default function DepositsPage() {
  const { data: session } = useSession();
  const [packages, setPackages] = useState<Package[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [coinType, setCoinType] = useState('USDT');
  const [network, setNetwork] = useState('TRC20');
  
  // Form state
  const [selectedPackage, setSelectedPackage] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, depositsRes, walletRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/deposits'),
        fetch('/api/admin/deposit-wallet')
      ]);
      
      if (packagesRes.ok) setPackages(await packagesRes.json());
      if (depositsRes.ok) setDeposits(await depositsRes.json());
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWalletAddress(walletData.address || '');
        setCoinType(walletData.coinType || 'USDT');
        setNetwork(walletData.network || 'TRC20');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          amount: Number(amount),
          transactionHash,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit deposit');
      }
      
      const newDeposit = await res.json();
      setDeposits([newDeposit, ...deposits]);
      setSelectedPackage('');
      setAmount('');
      setTransactionHash('');
      setSuccess('Deposit request submitted successfully! Awaiting admin approval.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get selected package details
  const selectedPkg = packages.find(pkg => pkg._id === selectedPackage);
  const minAmount = selectedPkg?.minAmount || 0;
  const maxAmount = selectedPkg?.maxAmount || 0;
  const roi = selectedPkg?.roiPercentage || 0;

  // Validation
  const isAmountValid = amount && Number(amount) >= minAmount && Number(amount) <= maxAmount;
  const isFormValid = selectedPackage && isAmountValid && transactionHash;

  // Filtered deposits
  const filteredDeposits = deposits.filter((dep) => {
    const matchesStatus = filterStatus ? dep.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchesSearch = search
      ? dep.txHash.toLowerCase().includes(search.toLowerCase()) ||
        dep.status.toLowerCase().includes(search.toLowerCase()) ||
        dep.packageId?.name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const paginatedDeposits = filteredDeposits.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDeposits.length / pageSize) || 1;

  // Calculate stats
  const totalApprovedAmount = deposits
    .filter(d => d.status.toLowerCase() === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingCount = deposits.filter(d => d.status.toLowerCase() === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Make a Deposit</h1>
          <p className="text-sm font-light text-gray-500">Fund your choice yield pool and watch your positions grow automatically</p>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-tr from-purple-100/30 to-pink-100/20 border border-purple-100 rounded-[28px] p-6 shadow-sm">
          <h2 className="font-syne text-lg font-bold text-[#7c3aed] mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#e040fb]" />
            Telemetry Funding Instructions
          </h2>
          <ol className="list-decimal ml-6 text-sm text-gray-600 space-y-1.5 font-light">
            <li>Select your preferred investment yield pool tier below.</li>
            <li>Enter the target principal amount you wish to allocate (must fit inside pool range).</li>
            <li>Transfer your digital assets to the designated admin wallet listed below.</li>
            <li>Copy your transaction hash (TxID) after finalizing the transfer.</li>
            <li>Input the hash inside the verification block and execute submit.</li>
          </ol>
        </div>

        {/* Stats Grid */}
        {deposits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Telemetry requests</span>
              <p className="font-syne text-2xl font-bold text-gray-900">{deposits.length}</p>
            </div>
            <div className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Approved Principal</span>
              <p className="font-syne text-2xl font-bold text-emerald-600">${totalApprovedAmount.toLocaleString()}</p>
            </div>
            <div className="glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Pending approval</span>
              <p className="font-syne text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
          </div>
        )}

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* New Deposit Form */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            <h2 className="font-syne text-xl font-bold text-gray-900 mb-6">Initialize New Allocation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Package Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Yield Pool</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {packages.map(pkg => (
                    <button
                      key={pkg._id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg._id)}
                      className={`p-4 rounded-[20px] border-2 text-left transition-all duration-300 ${
                        selectedPackage === pkg._id
                          ? 'border-[#7c3aed] bg-[#7c3aed]/5 shadow-sm'
                          : 'border-purple-50 bg-white/50 hover:border-purple-100'
                      }`}
                    >
                      <div className="font-syne font-bold text-md text-gray-800">{pkg.name}</div>
                      <div className="text-[11px] text-gray-400 font-light mt-1">
                        ${pkg.minAmount.toLocaleString()} - ${pkg.maxAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-[#7c3aed] font-bold mt-1">
                        {pkg.roiPercentage}% Daily ROI
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-gray-400">Principal Amount (USD)</Label>
                <div className="relative flex items-center mt-1">
                  <span className="absolute left-4 font-bold text-gray-400">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={selectedPkg ? `${minAmount} - ${maxAmount}` : 'Please select yield pool tier...'}
                    disabled={!selectedPackage}
                    className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-8 pr-4 text-sm focus-visible:ring-purple-200"
                  />
                </div>
                {amount && !isAmountValid && selectedPackage && (
                  <p className="text-xs text-rose-500 mt-1">
                    Target must reside inside pool limits: ${minAmount.toLocaleString()} to ${maxAmount.toLocaleString()}
                  </p>
                )}
                {selectedPkg && isAmountValid && (
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">
                    Expected yield: ${((Number(amount) || 0) * roi / 100).toFixed(2)} / daily
                  </p>
                )}
              </div>

              {/* Wallet Address & Details */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Deposit Funding Method</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1.5 mb-3">
                    <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Transfer Asset</span>
                      <span className="text-sm font-bold text-gray-800">{coinType}</span>
                    </div>
                    <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Required Network</span>
                      <span className="text-sm font-bold text-[#7c3aed]">{network}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Vault Address ({coinType} - {network})</Label>
                  <div className="flex gap-2">
                    <Input
                      value={walletAddress}
                      readOnly
                      className="flex-1 font-mono text-xs rounded-2xl border-purple-100 bg-gray-50 py-6 px-4"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => copyToClipboard(walletAddress)}
                      className="rounded-2xl h-auto border-purple-100 hover:bg-purple-50"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-light">Transfer exactly the entered amount using the {network} network to this secure vault address</p>
                </div>
              </div>

              {/* Tx Hash */}
              <div className="space-y-2">
                <Label htmlFor="txHash" className="text-xs font-bold uppercase tracking-wider text-gray-400">Blockchain Transaction ID (TxHash)</Label>
                <Input
                  id="txHash"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  placeholder="Paste transaction hash / TxID..."
                  className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm font-mono focus-visible:ring-purple-200"
                />
              </div>

              {/* Success/Error Alerts */}
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
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying transfer...
                  </>
                ) : (
                  'Deploy Principal Allocation'
                )}
              </Button>
            </form>
          </div>

          {/* Deposit Ledger */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col justify-between">
            <div>
              <h2 className="font-syne text-xl font-bold text-gray-900 mb-6">Deposit Ledgers</h2>
              
              {/* Search/Filter block */}
              <div className="flex gap-2 mb-6">
                <Input
                  type="text"
                  placeholder="Search hashes..."
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

              {/* Table */}
              <div className="overflow-x-auto">
                {paginatedDeposits.length === 0 ? (
                  <div className="text-center text-gray-400 py-12 font-light">
                    No matching deposit transactions found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedDeposits.map((dep) => (
                      <div 
                        key={dep._id} 
                        className="p-4 rounded-2xl bg-white/70 border border-purple-50/50 flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-syne font-bold text-sm text-gray-800">
                              {dep.packageId?.name || 'Yield Pool'}
                            </span>
                            <span className="text-[10px] text-gray-400">•</span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {dep.txHash ? `${dep.txHash.slice(0, 8)}...` : 'Internal'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-light">
                            <Calendar className="h-3 w-3" />
                            {new Date(dep.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <p className="font-syne font-bold text-gray-800 text-sm">
                            +${dep.amount.toLocaleString()}
                          </p>
                          <Badge
                            className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                              dep.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : dep.status === 'declined'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {dep.status}
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
