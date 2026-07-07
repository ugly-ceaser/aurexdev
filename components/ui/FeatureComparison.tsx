'use client';

import { Shield, Smartphone, GraduationCap, CreditCard, Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PlanFeature {
  name: string;
  starter: string | boolean;
  professional: string | boolean;
  premium: string | boolean;
  elite: string | boolean;
}

export default function FeatureComparison() {
  const allInclude = [
    { icon: Shield, text: 'Regulated & Secure' },
    { icon: Smartphone, text: 'Mobile Trading' },
    { icon: GraduationCap, text: 'Free Education' },
    { icon: CreditCard, text: 'No Hidden Fees' },
  ];

  const features: PlanFeature[] = [
    { name: 'Principal Range', starter: '$100 - $999', professional: '$1,000 - $4,999', premium: '$5,000 - $19,999', elite: '$20,000 - $100,000' },
    { name: 'Daily ROI Accrued', starter: '12%', professional: '15%', premium: '20%', elite: '30%' },
    { name: 'Lockup Period', starter: '30 Days', professional: '30 Days', premium: '30 Days', elite: '30 Days' },
    { name: 'Trading Signals', starter: false, professional: true, premium: 'AI-Powered', elite: 'AI + Priority' },
    { name: 'Account Manager', starter: false, professional: false, premium: true, elite: 'Dedicated' },
    { name: 'Support Tier', starter: 'Email Support', professional: 'Priority Support', premium: 'VIP Support', elite: '24/7 Concierge' },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <Check className="h-5 w-5 text-emerald-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-rose-500 mx-auto" />
      );
    }
    if (val.includes('AI-Powered') || val.includes('Dedicated') || val.includes('AI + Priority') || val.includes('Concierge')) {
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
          All Yield Pools Include
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
          Yield Pool Comparison
        </span>
      </div>

      {/* Desktop Layout: Table */}
      <div className="hidden md:block bg-white/80 backdrop-blur-md border border-gray-250/30 rounded-3xl overflow-hidden shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/60">
              <th className="text-left pb-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-1/5">
                Features
              </th>
              <th className="pb-4 text-center text-sm font-bold text-gray-800 w-1/5">
                Starter Pool
              </th>
              <th className="pb-4 text-center text-sm font-bold text-gray-800 w-1/5">
                Professional
              </th>
              <th className="pb-4 text-center text-sm font-bold text-[#7c3aed] w-1/5">
                Premium
              </th>
              <th className="pb-4 text-center text-sm font-bold text-amber-500 w-1/5">
                Elite
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
                  {renderValue(feat.professional)}
                </td>
                <td className="py-4 text-center text-sm font-medium">
                  {renderValue(feat.premium)}
                </td>
                <td className="py-4 text-center text-sm font-medium">
                  {renderValue(feat.elite)}
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
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Tier 1</span>
          <h4 className="font-syne text-xl font-bold text-gray-900 mb-4">Starter Pool</h4>
          <ul className="space-y-3.5 mb-6 text-sm text-gray-600 font-medium">
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Principal limits</span>
              <strong className="text-gray-900">$100 - $999</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Daily ROI</span>
              <strong className="text-gray-900">12%</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Lockup Period</span>
              <strong className="text-gray-900">30 Days</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Trading Signals</span>
              <span className="text-rose-500 font-bold">✕</span>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Account Manager</span>
              <span className="text-rose-500 font-bold">✕</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Support Tier</span>
              <strong className="text-gray-900 font-bold">Email</strong>
            </li>
          </ul>
          <Link href="/auth/register" className="block w-full">
            <button className="w-full bg-[#f0eee9] hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              Deploy Principal <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {/* Professional Plan Card */}
        <div className="bg-white border border-purple-200 ring-2 ring-purple-500/10 rounded-3xl p-6 shadow-sm text-left">
          <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest block mb-1">Tier 2</span>
          <h4 className="font-syne text-xl font-bold text-gray-900 mb-4">Professional</h4>
          <ul className="space-y-3.5 mb-6 text-sm text-gray-600 font-medium">
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Principal limits</span>
              <strong className="text-gray-900">$1,000 - $4,999</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Daily ROI</span>
              <strong className="text-gray-900">15%</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Lockup Period</span>
              <strong className="text-gray-900">30 Days</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Trading Signals</span>
              <span className="text-emerald-500 font-bold">✓ Standard</span>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-2">
              <span>Account Manager</span>
              <span className="text-rose-500 font-bold">✕</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Support Tier</span>
              <strong className="text-gray-900 font-bold">Priority</strong>
            </li>
          </ul>
          <Link href="/auth/register" className="block w-full">
            <button className="w-full bg-[#7c3aed] hover:bg-[#6b2fd5] text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              Deploy Principal <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {/* Premium Plan Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md text-left text-white">
          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest block mb-1">Tier 3</span>
          <h4 className="font-syne text-xl font-bold text-white mb-4">Premium</h4>
          <ul className="space-y-3.5 mb-6 text-sm text-slate-300 font-medium">
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Principal limits</span>
              <strong className="text-white">$5,000 - $19,999</strong>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Daily ROI</span>
              <strong className="text-white">20%</strong>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Lockup Period</span>
              <strong className="text-white">30 Days</strong>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Trading Signals</span>
              <span className="text-amber-500 font-bold">✓ AI-Powered</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Account Manager</span>
              <span className="text-amber-500 font-bold">✓ Dedicated</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Support Tier</span>
              <strong className="text-white font-bold">VIP Priority</strong>
            </li>
          </ul>
          <Link href="/auth/register" className="block w-full">
            <button className="w-full bg-[#7c3aed] hover:bg-[#6b2fd5] text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              Deploy Principal <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {/* Elite Card */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 shadow-xl text-left text-white ring-1 ring-amber-500/10">
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-1">Tier 4</span>
          <h4 className="font-syne text-xl font-bold text-amber-500 mb-4">Elite</h4>
          <ul className="space-y-3.5 mb-6 text-sm text-slate-300 font-medium">
            <li className="flex justify-between border-b border-slate-850 pb-2 border-slate-800">
              <span>Principal limits</span>
              <strong className="text-white">$20,000 - $100,000</strong>
            </li>
            <li className="flex justify-between border-b border-slate-850 pb-2 border-slate-800">
              <span>Daily ROI</span>
              <strong className="text-amber-500">30%</strong>
            </li>
            <li className="flex justify-between border-b border-slate-850 pb-2 border-slate-800">
              <span>Lockup Period</span>
              <strong className="text-white">30 Days</strong>
            </li>
            <li className="flex justify-between border-b border-slate-850 pb-2 border-slate-800">
              <span>Trading Signals</span>
              <span className="text-amber-500 font-bold">✓ AI + Priority</span>
            </li>
            <li className="flex justify-between border-b border-slate-850 pb-2 border-slate-800">
              <span>Account Manager</span>
              <span className="text-amber-500 font-bold">✓ 24/7 Personal</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Support Tier</span>
              <strong className="text-amber-500 font-bold">24/7 Concierge</strong>
            </li>
          </ul>
          <Link href="/auth/register" className="block w-full">
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
              Deploy Principal <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Pricing Question and CTA Button */}
      <div className="space-y-4 pt-4">
        <p className="text-sm font-medium text-gray-500">
          Not Sure Which Yield Pool to Choose? <br />
          Start with our Starter Pool and scale up anytime.
        </p>
        <Link href="/auth/register">
          <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-md shadow-amber-500/10 text-sm mt-3">
            Open Free Account
          </button>
        </Link>
      </div>
    </div>
  );
}
