'use client';

import { useState } from 'react';
import { ShieldAlert, TrendingUp, Landmark, FileText, BarChart, Info, HelpCircle } from 'lucide-react';

interface EconomicEvent {
  time: string;
  day: 'Today' | 'Tomorrow';
  currency: string;
  event: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  forecast: string;
  previous: string;
}

export default function EconomicCalendar() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');

  const events: EconomicEvent[] = [
    {
      time: '09:30',
      day: 'Today',
      currency: 'USD',
      event: 'Non-Farm Payrolls',
      description: 'Employment data',
      impact: 'High',
      forecast: '185K',
      previous: '178K',
    },
    {
      time: '10:00',
      day: 'Today',
      currency: 'EUR',
      event: 'ECB Interest Rate Decision',
      description: 'Monetary policy',
      impact: 'High',
      forecast: '4.50%',
      previous: '4.50%',
    },
    {
      time: '14:30',
      day: 'Today',
      currency: 'GBP',
      event: 'GDP Growth Rate',
      description: 'Economic growth',
      impact: 'Medium',
      forecast: '0.3%',
      previous: '0.2%',
    },
    {
      time: '16:00',
      day: 'Today',
      currency: 'CAD',
      event: 'Building Permits',
      description: 'Housing data',
      impact: 'Low',
      forecast: '1.2%',
      previous: '-0.8%',
    },
    {
      time: '08:30',
      day: 'Tomorrow',
      currency: 'USD',
      event: 'Consumer Price Index',
      description: 'Inflation data',
      impact: 'High',
      forecast: '3.2%',
      previous: '3.1%',
    },
    {
      time: '12:00',
      day: 'Tomorrow',
      currency: 'EUR',
      event: 'Industrial Production',
      description: 'Manufacturing data',
      impact: 'Medium',
      forecast: '0.1%',
      previous: '-0.3%',
    },
  ];

  const currencies = ['ALL', 'USD', 'EUR', 'GBP', 'CAD'];

  const filteredEvents = selectedCurrency === 'ALL'
    ? events
    : events.filter(e => e.currency === selectedCurrency);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full text-left">
      {/* Upcoming Events Table */}
      <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-gray-250/30 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-syne text-lg font-bold text-gray-900 flex items-center gap-2">
              Upcoming Events
            </h3>
            {/* Filter buttons */}
            <div className="flex gap-1.5 bg-[#f0eee9] p-1 rounded-xl w-fit">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-250 ${
                    selectedCurrency === curr
                      ? 'bg-[#7c3aed] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200/60 pb-3">
                  <th className="text-left pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="text-left pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Currency</th>
                  <th className="text-left pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Event</th>
                  <th className="text-left pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Impact</th>
                  <th className="text-right pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Forecast</th>
                  <th className="text-right pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((evt, idx) => {
                  let impactColor = 'bg-gray-100 text-gray-600';
                  if (evt.impact === 'High') {
                    impactColor = 'bg-rose-500/10 text-rose-600';
                  } else if (evt.impact === 'Medium') {
                    impactColor = 'bg-amber-500/10 text-amber-600';
                  }

                  let currencyColor = 'bg-blue-500/10 text-blue-600';
                  if (evt.currency === 'USD') currencyColor = 'bg-blue-600 text-white';
                  else if (evt.currency === 'EUR') currencyColor = 'bg-amber-500 text-slate-900';
                  else if (evt.currency === 'GBP') currencyColor = 'bg-emerald-650 bg-emerald-600 text-white';
                  else if (evt.currency === 'CAD') currencyColor = 'bg-cyan-500 text-slate-900';

                  return (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-bold text-gray-900 block">{evt.time}</span>
                        <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{evt.day}</span>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${currencyColor}`}>
                          {evt.currency}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-bold text-gray-900 block">{evt.event}</span>
                        <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{evt.description}</span>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${impactColor}`}>
                          {evt.impact}
                        </span>
                      </td>
                      <td className="py-4 text-right font-mono text-sm font-bold text-gray-800 whitespace-nowrap">
                        {evt.forecast}
                      </td>
                      <td className="py-4 text-right font-mono text-sm font-medium text-gray-500 whitespace-nowrap">
                        {evt.previous}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Market Impact Guide Sidebar */}
      <div className="space-y-6">
        {/* Guide Card */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-250/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Info className="h-4.5 w-4.5 text-blue-600" />
              <h4 className="font-syne text-sm font-bold text-gray-900">
                Market Impact Guide
              </h4>
            </div>

            <div className="space-y-4">
              {/* Impact Levels */}
              <div>
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Impact Levels
                </h5>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-500/10 text-rose-600">High</span>
                    Major market movement expected
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-600">Medium</span>
                    Moderate market reaction possible
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-gray-100 text-gray-500">Low</span>
                    Minimal market impact expected
                  </li>
                </ul>
              </div>

              {/* Key Events to Watch */}
              <div className="pt-2 border-t border-gray-100">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Key Events to Watch
                </h5>
                <ul className="grid grid-cols-2 gap-3 text-xs text-gray-700 font-semibold">
                  <li className="flex items-center gap-2.5">
                    <Landmark className="h-4 w-4 text-purple-500" /> Central Bank Decisions
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-blue-500" /> Employment Reports
                  </li>
                  <li className="flex items-center gap-2.5">
                    <TrendingUp className="h-4 w-4 text-emerald-500" /> Inflation Data
                  </li>
                  <li className="flex items-center gap-2.5">
                    <BarChart className="h-4 w-4 text-cyan-500" /> GDP Releases
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="bg-[#fffbeb] border border-amber-200 rounded-3xl p-5 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-amber-900">Trading Tip</h5>
            <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
              High-impact events can cause significant volatility. Consider adjusting your position sizes and stop-loss levels accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
