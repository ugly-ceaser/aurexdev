'use client';

import { TrendingUp, TrendingDown, Coins, Activity, Globe, Percent } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  change: string;
  isPositive?: boolean;
  isNeutral?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MarketMetricsBar() {
  const metrics: MetricItem[] = [
    {
      label: 'Market Cap',
      value: '$2.1T',
      change: '+2.4% (24h)',
      isPositive: true,
      icon: Globe,
    },
    {
      label: '24h Volume',
      value: '$89.2B',
      change: '-1.2% (24h)',
      isPositive: false,
      icon: Activity,
    },
    {
      label: 'BTC Dominance',
      value: '52.3%',
      change: '+0.8% (24h)',
      isPositive: true,
      icon: Percent,
    },
    {
      label: 'Active Coins',
      value: '2,847',
      change: 'Tracked',
      isNeutral: true,
      icon: Coins,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-[#12131a]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:border-[#7c3aed]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/10"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {item.label}
              </span>
              <h4 className="font-syne text-2xl font-extrabold text-white tracking-tight">
                {item.value}
              </h4>
              <div className="flex items-center gap-1 mt-1">
                {item.isNeutral ? (
                  <span className="text-xs text-gray-400 font-medium">
                    {item.change}
                  </span>
                ) : item.isPositive ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> {item.change}
                  </span>
                ) : (
                  <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                    <TrendingDown className="h-3 w-3" /> {item.change}
                  </span>
                )}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gray-800/40 border border-gray-700/30 flex items-center justify-center text-gray-400">
              <Icon className="h-5 w-5 text-gray-300" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
