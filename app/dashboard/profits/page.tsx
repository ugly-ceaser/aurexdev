'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Profit {
  _id: string;
  amount: number;
  description?: string;
  createdAt: string;
}

export default function ProfitsPage() {
  const [profits, setProfits] = useState<Profit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profits')
      .then(res => res.json())
      .then(data => {
        setProfits(data);
        setLoading(false);
      })
      .catch(() => {
        setProfits([]);
        setLoading(false);
      });
  }, []);

  const totalProfits = profits.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Cumulative Yields</h1>
          <p className="text-sm font-light text-gray-500">Immutably audited records of your daily quantitative ROI payouts</p>
        </div>

        {/* Total Profits Card */}
        <div className="bg-gradient-to-tr from-purple-500/10 via-white to-emerald-500/5 border border-purple-100 rounded-[28px] p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Profits Earned</span>
            <p className="font-syne text-3xl font-extrabold text-emerald-600">
              {formatCurrency(totalProfits)}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Profits Table Card */}
        <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-syne text-xl font-bold text-gray-900">Yield Accrual Ledgers</h3>
            <Sparkles className="h-5 w-5 text-[#7c3aed]" />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#7c3aed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-xs font-semibold text-gray-500">Querying ledgers...</span>
            </div>
          ) : profits.length === 0 ? (
            <div className="text-center text-gray-400 py-12 font-light">
              No quantitative yields credited to this account yet.
            </div>
          ) : (
            <div className="space-y-3">
              {profits.map((p) => (
                <div 
                  key={p._id}
                  className="p-4 rounded-2xl bg-white/70 border border-purple-50/50 flex items-center justify-between hover:bg-white transition-all duration-300"
                >
                  <div className="space-y-1">
                    <span className="font-syne font-bold text-sm text-gray-800">
                      {p.description || 'AI Arbitrage Yield'}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-light">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-syne font-bold text-emerald-600 text-sm">
                      +{formatCurrency(p.amount)}
                    </p>
                    <Badge className="bg-emerald-50 text-emerald-700 font-bold border-none text-[9px] uppercase px-2 rounded-full mt-0.5">
                      Settled
                    </Badge>
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
