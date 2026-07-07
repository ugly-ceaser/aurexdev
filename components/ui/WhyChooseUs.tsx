'use client';

import { ShieldCheck, Zap, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: ShieldCheck,
      title: 'Regulated & Licensed',
      description: 'Fully regulated by top financial authorities worldwide, ensuring security and compliance.',
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      icon: Zap,
      title: 'Fast Execution',
      description: 'Lightning-fast order execution with minimal slippage using advanced trading server grids.',
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      icon: Smartphone,
      title: 'Multiple Platforms',
      description: 'Access your investments via fully synchronized web, desktop, and mobile user interfaces.',
      color: 'text-blue-500 bg-blue-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full text-left max-w-6xl mx-auto">
      {/* Left side: Information List */}
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-4">
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Why Choose <br className="hidden sm:inline" />
            <span className="text-[#7c3aed]">Aurex Capital</span>?
          </h2>
          <p className="text-gray-500 font-light text-lg max-w-lg leading-relaxed">
            We are committed to providing the best forex trading experience with cutting-edge technology and unparalleled support.
          </p>
        </div>

        <div className="space-y-5">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex gap-4 items-start">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-gray-800 text-base mb-1">{item.title}</h4>
                  <p className="text-sm font-light text-gray-500 leading-relaxed max-w-md">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Marketing Summary box */}
      <div className="lg:col-span-5 flex justify-center w-full">
        <div className="bg-[#0a0a0c] border border-gray-850 text-white rounded-[32px] p-8 w-full max-w-sm flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7c3aed]/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />

          <div className="relative z-10 w-full space-y-8">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block">
              Start Trading Today
            </span>

            <div className="space-y-6">
              <div>
                <span className="font-syne text-4xl font-extrabold text-white block">$100</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Minimum Deposit
                </span>
              </div>
              
              <div>
                <span className="font-syne text-4xl font-extrabold text-white block">1:500</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Max Leverage
                </span>
              </div>

              <div>
                <span className="font-syne text-4xl font-extrabold text-white block">50+</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Currency Pairs
                </span>
              </div>
            </div>

            <Link href="/auth/register" className="block w-full pt-4">
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-md shadow-amber-500/10 flex items-center justify-center gap-2">
                <span>Open Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
