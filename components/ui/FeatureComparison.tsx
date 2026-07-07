'use client';

import { Shield, Smartphone, GraduationCap, CreditCard, Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PlanFeature {
  name: string;
  starter: string | boolean;
  gold: string | boolean;
  zenith: string | boolean;
}

export default function FeatureComparison() {
  const allInclude = [
    { icon: Shield, text: 'Regulated & Secure' },
    { icon: Smartphone, text: 'Mobile Trading' },
    { icon: GraduationCap, text: 'Free Education' },
    { icon: CreditCard, text: 'No Hidden Fees' },
  ];

  const features: PlanFeature[] = [
    { name: 'Minimum Deposit', starter: '$100', gold: '$3,000', zenith: '$10,000' },
    { name: 'Spreads From', starter: '1.5 pips', gold: '0.5 pips', zenith: '0.1 pips' },
    { name: 'Maximum Leverage', starter: '1:100', gold: '1:300', zenith: '1:500' },
    { name: 'Currency Pairs', starter: '30+', gold: '50+', zenith: '70+' },
    { name: 'Trading Signals', starter: false, gold: true, zenith: 'AI-Powered' },
    { name: 'Account Manager', starter: false, gold: true, zenith: 'Dedicated' },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <Check className="h-5 w-5 text-emerald-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-rose-500 mx-auto" />
      );
    }
    if (val.includes('AI-Powered') || val.includes('Dedicated')) {
      return (
        <span className="flex items-center justify-center gap-1 font-bold text-amber-500">
          <Check className="h-4 w-4 text-amber-500" /> {val}
        </span>
      );
    }
    return <span className="font-bold text-gray-800">{val}</span>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 text-center">
      {/* All Plans Include banner */}
      <div className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-3xl p-6 sm:px-12 shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">
          All Plans Include
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allInclude.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-amber-550" />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Comparison Table Title */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest block">
          Feature Comparison
        </span>
      </div>

      {/* Desktop Layout: Table */}
      <div className="hidden md:block bg-white/80 backdrop-blur-md border border-gray-250/30 rounded-3xl overflow-hidden shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/60">
              <th className="text-left pb-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-1/4">
                Features
              </th>
              <th className="pb-4 text-center text-base font-bold text-gray-800 w-1/4">
                Starter Plan
              </th>
              <th className="pb-4 text-center text-base font-bold text-gray-800 w-1/4">
                Gold Plan
              </th>
              <th className="pb-4 text-center text-base font-bold text-amber-500 w-1/4">
                Zenith
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {features.map((feat, idx) => (
              <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                <td className="py-4 text-left text-sm font-bold text-gray-500">
                  {feat.name}
                </td>
                <td className="py-4 text-center text-sm font-medium">
                  {renderValue(feat.starter)}
                </td>
                <td className="py-4 text-center text-sm font-medium">
                  {renderValue(feat.gold)}
                </td>
                <td className="py-4 text-center text-sm font-medium">
                  {renderValue(feat.zenith)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout: Stacked Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {/* Starter Plan Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Entry Level</span>
          <h4 className="font-syne text-xl font-bold text-gray-900 mb-4">Starter Plan</h4>
          <ul className="space-y-3.5 mb-6 text-sm text-gray-600 font-medium">
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Minimum Deposit</span>
              <strong className="text-gray-900">$100</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Spreads From</span>
              <strong className="text-gray-900">1.5 pips</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Maximum Leverage</span>
              <strong className="text-gray-900">1:100</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Currency Pairs</span>
              <strong className="text-gray-900">30+</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Trading Signals</span>
              <span className="text-rose-500 font-bold">✕</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Account Manager</span>
              <span className="text-rose-500 font-bold">✕</span>
            </li>
          </ul>
          <Link href="/auth/register" className="block w-full">
            <button className="w-full bg-[#f0eee9] hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {/* Gold Plan Card */}
        <div className="bg-white border border-purple-200 ring-2 ring-purple-500/10 rounded-3xl p-6 shadow-sm text-left">
          <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest block mb-1">Recommended</span>
          <h4 className="font-syne text-xl font-bold text-gray-900 mb-4">Gold Plan</h4>
          <ul className="space-y-3.5 mb-6 text-sm text-gray-600 font-medium">
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Minimum Deposit</span>
              <strong className="text-gray-900">$3,000</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Spreads From</span>
              <strong className="text-gray-900">0.5 pips</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Maximum Leverage</span>
              <strong className="text-gray-900">1:300</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Currency Pairs</span>
              <strong className="text-gray-900">50+</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Trading Signals</span>
              <span className="text-emerald-500 font-bold">✓</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Account Manager</span>
              <span className="text-emerald-500 font-bold">✓</span>
            </li>
          </ul>
          <Link href="/auth/register" className="block w-full">
            <button className="w-full bg-[#7c3aed] hover:bg-[#6b2fd5] text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {/* Zenith Card */}
        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-md text-left text-white">
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-1">VIP Plan</span>
          <h4 className="font-syne text-xl font-bold text-white mb-4">Zenith Plan</h4>
          <ul className="space-y-3.5 mb-6 text-sm text-slate-300 font-medium">
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Minimum Deposit</span>
              <strong className="text-white">$10,000</strong>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Spreads From</span>
              <strong className="text-white">0.1 pips</strong>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Maximum Leverage</span>
              <strong className="text-white">1:500</strong>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Currency Pairs</span>
              <strong className="text-white">70+</strong>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Trading Signals</span>
              <span className="text-amber-500 font-bold">✓ AI-Powered</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Account Manager</span>
              <span className="text-amber-500 font-bold">✓ Dedicated</span>
            </li>
          </ul>
          <Link href="/auth/register" className="block w-full">
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Pricing Question and CTA Button */}
      <div className="space-y-4 pt-4">
        <p className="text-sm font-medium text-gray-500">
          Not Sure Which Plan to Choose? <br />
          Start with our demo account and upgrade anytime
        </p>
        <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-md shadow-amber-500/10 text-sm">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
