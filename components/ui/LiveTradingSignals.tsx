'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, Clock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface Signal {
  pair: string;
  type: 'BUY' | 'SELL' | 'WATCH';
  strength: 'Strong' | 'Medium' | 'Pending';
  entry: string;
  tp: string;
  sl: string;
  confidence: number;
  timeAgo: string;
}

export default function LiveTradingSignals() {
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);
  const [animatedWinRate, setAnimatedWinRate] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedAccuracy(87);
      setAnimatedWinRate(82);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const signals: Signal[] = [
    {
      pair: 'EUR/USD',
      type: 'BUY',
      strength: 'Strong',
      entry: '1.0892',
      tp: '1.0950',
      sl: '1.0850',
      confidence: 85,
      timeAgo: '2 hours ago',
    },
    {
      pair: 'GBP/USD',
      type: 'SELL',
      strength: 'Medium',
      entry: '1.2734',
      tp: '1.2680',
      sl: '1.2780',
      confidence: 72,
      timeAgo: '45 minutes ago',
    },
    {
      pair: 'USD/JPY',
      type: 'BUY',
      strength: 'Strong',
      entry: '149.82',
      tp: '151.20',
      sl: '148.50',
      confidence: 91,
      timeAgo: '1 hour ago',
    },
    {
      pair: 'AUD/USD',
      type: 'WATCH',
      strength: 'Pending',
      entry: '0.6543',
      tp: '0.6600',
      sl: '0.6500',
      confidence: 68,
      timeAgo: '30 minutes ago',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      {/* Active Signals List */}
      <div className="lg:col-span-2 bg-[#12131a]/95 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-syne text-xl font-bold text-white">Active Signals</h3>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {signals.map((sig, idx) => {
              const isBuy = sig.type === 'BUY';
              const isWatch = sig.type === 'WATCH';
              
              // Border color based on status
              let cardBorder = 'border-gray-800/85 hover:border-gray-700';
              let badgeBg = 'bg-gray-800 text-gray-400';
              if (sig.strength === 'Strong') {
                cardBorder = 'border-emerald-900/30 hover:border-emerald-700/50';
                badgeBg = 'bg-emerald-500/10 text-emerald-400';
              } else if (sig.strength === 'Medium') {
                cardBorder = 'border-amber-900/30 hover:border-amber-700/50';
                badgeBg = 'bg-amber-500/10 text-amber-400';
              } else if (sig.strength === 'Pending') {
                cardBorder = 'border-blue-900/30 hover:border-blue-700/50';
                badgeBg = 'bg-blue-500/10 text-blue-400';
              }

              return (
                <div
                  key={idx}
                  className={`bg-[#0e1017]/80 rounded-2xl p-5 border ${cardBorder} transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/5 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-syne text-lg font-bold text-white tracking-tight">
                          {sig.pair}
                        </h4>
                        <span className={`text-xs font-bold ${isBuy ? 'text-emerald-450 text-emerald-400' : isWatch ? 'text-blue-400' : 'text-amber-500'}`}>
                          {sig.type} Signal
                        </span>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${badgeBg}`}>
                        {sig.strength}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#08090d] border border-gray-800/40 rounded-xl p-3 text-center mb-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                          Entry
                        </span>
                        <span className="font-mono text-xs font-bold text-white block">
                          {sig.entry}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                          TP
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-450 text-emerald-450 block">
                          {sig.tp}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                          SL
                        </span>
                        <span className="font-mono text-xs font-bold text-rose-500 block">
                          {sig.sl}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800/40 pt-3">
                    <span className="font-medium">
                      Confidence: <strong className="text-gray-200">{sig.confidence}%</strong>
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" /> {sig.timeAgo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signal Performance Container */}
      <div className="bg-[#12131a]/95 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-syne text-xl font-bold text-white mb-6">Signal Performance</h3>

          <div className="space-y-5 mb-8">
            {/* Today's Accuracy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-300">Today&apos;s Accuracy</span>
                <span className="font-bold text-emerald-450 text-emerald-400">87%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedAccuracy}%` }}
                />
              </div>
            </div>

            {/* Weekly Win Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-300">Weekly Win Rate</span>
                <span className="font-bold text-emerald-450 text-emerald-400">82%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedWinRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats boxes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-4 text-center">
              <h5 className="font-syne text-3xl font-extrabold text-emerald-400 tracking-tight">24</h5>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Signals Today</span>
            </div>
            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-4 text-center">
              <h5 className="font-syne text-3xl font-extrabold text-[#7c3aed] tracking-tight">156</h5>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">This Week</span>
            </div>
          </div>
        </div>

        <div>
          <Link href="/auth/register" className="block w-full">
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-4 rounded-2xl transition-all duration-300 w-full text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10">
              <span>Get Premium Signals</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </Link>
          <span className="text-[11px] font-medium text-gray-400 block text-center mt-3">
            Upgrade for real-time alerts
          </span>
        </div>
      </div>
    </div>
  );
}
