'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Sparkles,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';

interface Transaction {
  _id: string;
  type: 'deposit' | 'withdrawal' | 'profit';
  amount: number;
  status: string;
  createdAt: string;
  packageName?: string;
  txHash?: string;
}

interface DashboardStats {
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  activePackage: string | null;
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingWithdrawalsAmount: number;
  recentTransactions: Transaction[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalProfits: 0,
    activePackage: null,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalsAmount: 0,
    recentTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardStats();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Current Balance',
      value: stats.balance,
      icon: DollarSign,
      description: 'Available for withdrawal',
      bgColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Total Deposits',
      value: stats.totalDeposits,
      icon: TrendingUp,
      description: 'All time deposits',
      bgColor: 'bg-blue-500/10 text-blue-600 border-blue-100',
    },
    {
      title: 'Total Withdrawals',
      value: stats.totalWithdrawals,
      icon: TrendingDown,
      description: 'All time withdrawals',
      bgColor: 'bg-rose-500/10 text-rose-600 border-rose-100',
    },
    {
      title: 'Total Profits',
      value: stats.totalProfits,
      icon: BarChart3,
      description: 'AI Yield accrued',
      bgColor: 'bg-purple-500/10 text-purple-600 border-purple-100',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-[#7c3aed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-sm font-semibold text-gray-500">Synchronizing secure telemetry...</span>
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
            <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Dashboard Overview</h1>
            <p className="text-sm font-light text-gray-500">Welcome to Aurex Capital, {session?.user?.name}</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-purple-100 rounded-full text-xs font-semibold text-[#7c3aed] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#4169e1] to-[#e040fb] animate-pulse" />
            AI Execution Live
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className="relative glass-panel rounded-[24px] p-6 shadow-sm border border-purple-50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {card.title}
                  </span>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${card.bgColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="font-syne text-2xl font-bold text-[#0f0e0d] tracking-tight">
                  {formatCurrency(card.value)}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pending Items Alert */}
        {(stats.pendingDeposits > 0 || stats.pendingWithdrawals > 0) && (
          <div className="glass-panel border-amber-200/50 bg-amber-50/50 rounded-[28px] p-6">
            <h3 className="font-syne text-lg font-bold text-amber-700 flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Telemetry Actions
            </h3>
            <div className="space-y-3">
              {stats.pendingDeposits > 0 && (
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-600">Deposits confirmation in progress</span>
                  <Badge className="bg-amber-100 text-amber-800 border-none font-semibold px-3 py-1 rounded-full">
                    {stats.pendingDeposits} awaiting approval
                  </Badge>
                </div>
              )}
              {stats.pendingWithdrawals > 0 && (
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-600">Pending withdrawals processing</span>
                  <Badge className="bg-amber-100 text-amber-800 border-none font-semibold px-3 py-1 rounded-full">
                    {stats.pendingWithdrawals} ({formatCurrency(stats.pendingWithdrawalsAmount)})
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Package */}
        {stats.activePackage && (
          <div className="bg-gradient-to-tr from-emerald-500/5 via-white to-purple-500/5 border border-emerald-200/40 rounded-[28px] p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Active Yield Pool</span>
              <h3 className="font-syne text-2xl font-bold text-gray-900">{stats.activePackage}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md animate-pulse">
              ✓
            </div>
          </div>
        )}

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Activity */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-syne text-xl font-bold text-gray-900">Recent Transactions</h3>
                <p className="text-xs text-gray-400 font-light mt-0.5">Your latest platform interactions</p>
              </div>
              <Activity className="h-5 w-5 text-purple-400" />
            </div>

            {stats.recentTransactions.length === 0 ? (
              <div className="text-center text-gray-400 py-12 font-light">
                No recent transactions on ledger.
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/70 border border-purple-50/50 hover:bg-white hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        tx.type === 'deposit' 
                          ? 'bg-blue-50 border-blue-100 text-blue-600' 
                          : tx.type === 'withdrawal'
                          ? 'bg-rose-50 border-rose-100 text-rose-600'
                          : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      }`}>
                        {tx.type === 'deposit' && <ArrowDownRight className="h-4 w-4" />}
                        {tx.type === 'withdrawal' && <ArrowUpRight className="h-4 w-4" />}
                        {tx.type === 'profit' && <Plus className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                          {tx.type}
                          {tx.packageName && ` - ${tx.packageName}`}
                        </p>
                        <p className="text-[11px] text-gray-400 font-light mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className={`font-syne font-bold ${
                        tx.type === 'deposit'
                          ? 'text-blue-600'
                          : tx.type === 'withdrawal'
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}>
                        {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                      </p>
                      <Badge 
                        className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                          tx.status === 'pending' 
                            ? 'bg-amber-100 text-amber-700' 
                            : tx.status === 'approved' || tx.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investment Performance */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-syne text-xl font-bold text-gray-900">Yield Analytics</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Your platform positions performance</p>
                </div>
                <Sparkles className="h-5 w-5 text-[#7c3aed]" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50/40 border border-blue-100/50 rounded-2xl">
                  <span className="text-sm font-medium text-gray-500">Total Invested base</span>
                  <span className="font-syne font-bold text-gray-800">{formatCurrency(stats.totalDeposits)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-emerald-50/40 border border-emerald-100/50 rounded-2xl">
                  <span className="text-sm font-medium text-gray-500">Total Earned ROI</span>
                  <span className="font-syne font-bold text-emerald-600">{formatCurrency(stats.totalProfits)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-rose-50/40 border border-rose-100/50 rounded-2xl">
                  <span className="text-sm font-medium text-gray-500">Total Withdrawn yield</span>
                  <span className="font-syne font-bold text-rose-600">{formatCurrency(stats.totalWithdrawals)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#4169e1]/5 via-[#7c3aed]/5 to-transparent border border-purple-200/40 rounded-2xl">
                  <span className="text-sm font-bold text-[#7c3aed]">Aggregate Yield Yield %</span>
                  <span className="font-syne font-extrabold text-transparent bg-gradient-to-r from-[#4169e1] to-[#e040fb] bg-clip-text text-xl">
                    {stats.totalDeposits > 0 
                      ? `${((stats.totalProfits / stats.totalDeposits) * 100).toFixed(2)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-50 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Net Position value</span>
              <span className={`font-syne font-extrabold text-2xl ${
                (stats.totalDeposits + stats.totalProfits - stats.totalWithdrawals) >= stats.totalDeposits
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}>
                {formatCurrency(stats.totalDeposits + stats.totalProfits - stats.totalWithdrawals)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}