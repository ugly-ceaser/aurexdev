'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function MarketSentimentDashboard() {
  const [overallSentiment, setOverallSentiment] = useState(0);
  const [fearGreedVal, setFearGreedVal] = useState(0);
  const [eurusdVal, setEurusdVal] = useState(0);
  const [gbpusdVal, setGbpusdVal] = useState(0);
  const [usdjpyVal, setUsdjpyVal] = useState(0);
  const [audusdVal, setAudusdVal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOverallSentiment(72);
      setFearGreedVal(76);
      setEurusdVal(78);
      setGbpusdVal(65);
      setUsdjpyVal(82);
      setAudusdVal(52);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Compute gauge needle coordinates for a 180-degree semi-circle gauge (radius = 45)
  // angle 0 starts at left horizontal, angle Math.PI starts at right horizontal
  const needleAngleRad = (overallSentiment / 100) * Math.PI;
  const needleX = 60 - 42 * Math.cos(needleAngleRad);
  const needleY = 60 - 42 * Math.sin(needleAngleRad);

  return (
    <div className="space-y-8 w-full">
      {/* Top Row: Overall Sentiment & Fear and Greed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Market Sentiment */}
        <div className="bg-[#12131a]/95 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne text-lg font-bold text-white">Overall Market Sentiment</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Info className="h-3.5 w-3.5" /> Telemetry
              </span>
            </div>

            {/* Gauge Graphic */}
            <div className="relative flex flex-col items-center justify-center pt-2">
              <svg className="w-52 h-32 overflow-visible" viewBox="0 0 120 70">
                {/* Background arc track */}
                <path
                  d="M 15 60 A 45 45 0 0 1 105 60"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Bullish zone indicator arc (right side) */}
                <path
                  d="M 60 15 A 45 45 0 0 1 105 60"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                {/* Bearish zone indicator arc (left side) */}
                <path
                  d="M 15 60 A 45 45 0 0 1 60 15"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.2"
                />
                {/* Needle */}
                <line
                  x1="60"
                  y1="60"
                  x2={needleX}
                  y2={needleY}
                  stroke="#7c3aed"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Center Hub */}
                <circle cx="60" cy="60" r="6" fill="#7c3aed" />
                <circle cx="60" cy="60" r="3" fill="#ffffff" />
              </svg>

              <div className="text-center -mt-3">
                <span className="font-syne text-xl font-extrabold text-emerald-400 block">
                  Bullish
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {overallSentiment}% Confidence
                </span>
              </div>
            </div>
          </div>

          {/* Sentiment Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="bg-[#0e1017] border border-gray-800/80 rounded-xl p-3 text-center">
              <span className="text-sm font-extrabold text-emerald-400 block">68%</span>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                Bullish
              </span>
            </div>
            <div className="bg-[#0e1017] border border-gray-800/80 rounded-xl p-3 text-center">
              <span className="text-sm font-extrabold text-amber-500 block">18%</span>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                Neutral
              </span>
            </div>
            <div className="bg-[#0e1017] border border-gray-800/80 rounded-xl p-3 text-center">
              <span className="text-sm font-extrabold text-rose-500 block">14%</span>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                Bearish
              </span>
            </div>
          </div>
        </div>

        {/* Fear & Greed Index */}
        <div className="bg-[#12131a]/95 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne text-lg font-bold text-white">Fear & Greed Index</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Active
              </span>
            </div>

            <div className="flex flex-col items-center justify-center pt-2">
              {/* Circular radial progress ring */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Outer circle track */}
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#1f2937" strokeWidth="2.5" />
                  {/* Progress border (using exact color representation) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="100"
                    strokeDashoffset={100 - fearGreedVal}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="text-center z-10">
                  <span className="font-syne text-3xl font-extrabold text-white block">
                    {fearGreedVal}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Greed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Slider Index */}
          <div className="space-y-3 mt-6">
            <div className="relative h-2 rounded-full overflow-visible" style={{ background: 'linear-gradient(to right, #ef4444, #f59e0b, #10b981, #047857)' }}>
              {/* Dial marker */}
              <div
                className="absolute -top-1 h-4 w-4 bg-white border-2 border-[#12131a] rounded-full shadow-md transition-all duration-1000 ease-out"
                style={{ left: `calc(${fearGreedVal}% - 8px)` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span className="text-rose-500">Extreme Fear</span>
              <span className="text-amber-500">Neutral</span>
              <span className="text-emerald-400">Greed</span>
              <span className="text-emerald-600">Extreme Greed</span>
            </div>
            <span className="text-[10px] font-medium text-gray-500 block text-center pt-1">
              Last updated: 2 minutes ago
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Card: Currency Pair Sentiment */}
      <div className="bg-[#12131a]/95 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6">
        <h3 className="font-syne text-lg font-bold text-white mb-6">Currency Pair Sentiment</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* EUR/USD */}
          <div className="bg-[#0e1017]/80 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-syne font-bold text-white">EUR/USD</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-450 text-emerald-400">
                Bullish
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${eurusdVal}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>{eurusdVal}% Bullish</span>
                <span className="text-emerald-400 font-bold">+2.3%</span>
              </div>
            </div>
          </div>

          {/* GBP/USD */}
          <div className="bg-[#0e1017]/80 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-syne font-bold text-white">GBP/USD</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                Bearish
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                  style={{ width: `${gbpusdVal}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>{gbpusdVal}% Bearish</span>
                <span className="text-rose-450 text-rose-455 text-rose-400 font-bold">-1.8%</span>
              </div>
            </div>
          </div>

          {/* USD/JPY */}
          <div className="bg-[#0e1017]/80 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-syne font-bold text-white">USD/JPY</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-450 text-emerald-400">
                Bullish
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${usdjpyVal}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>{usdjpyVal}% Bullish</span>
                <span className="text-emerald-400 font-bold">+3.1%</span>
              </div>
            </div>
          </div>

          {/* AUD/USD */}
          <div className="bg-[#0e1017]/80 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-syne font-bold text-white">AUD/USD</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                Neutral
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: `${audusdVal}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>{audusdVal}% Neutral</span>
                <span className="text-amber-500 font-bold">+0.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
