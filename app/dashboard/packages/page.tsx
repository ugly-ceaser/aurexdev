'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, TrendingUp, AlertCircle, Loader2, DollarSign, Calendar, Zap, Sparkles } from 'lucide-react';

interface Package {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roiPercentage: number;
  durationDays: number;
  isActive: boolean;
}

interface UserDeposit {
  _id: string;
  packageId: { _id: string; name: string };
  status: string;
}

export default function PackagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [activePackage, setActivePackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, profileRes, depositsRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/profile'),
        fetch('/api/deposits')
      ]);
      
      if (packagesRes.ok) {
        const data = await packagesRes.json();
        setPackages(data.filter((pkg: Package) => pkg.isActive));
      }
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserBalance(profileData.balance || 0);
      }
      
      if (depositsRes.ok) {
        const deposits: UserDeposit[] = await depositsRes.json();
        const approved = deposits.find(d => d.status === 'approved');
        if (approved) {
          setActivePackage(approved.packageId._id);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvestNow = (pkg: Package) => {
    router.push('/dashboard/deposits');
  };

  const getPackageFeatures = (packageName: string) => {
    const features: Record<string, string[]> = {
      'starter': [
        'Daily ROI Payments',
        'Secure Investment',
        'Real-time Tracking',
        'Email Support',
        'Mobile Access'
      ],
      'professional': [
        'Daily ROI Payments',
        'Secure Investment',
        'Real-time Tracking',
        'Priority Support',
        'Advanced Analytics',
        'Email Notifications'
      ],
      'premium': [
        'Daily ROI Payments',
        'Secure Investment',
        'Real-time Tracking',
        'VIP Support',
        'Advanced Analytics',
        'Custom Strategies',
        'Dedicated Manager'
      ],
      'elite': [
        'Daily ROI Payments',
        'Secure Investment',
        'Real-time Tracking',
        '24/7 VIP Support',
        'Personal Manager',
        'Exclusive Insights',
        'Priority Withdrawals',
        'Custom Portfolio'
      ]
    };
    
    return features[packageName.toLowerCase()] || features['starter'];
  };

  const calculateDailyProfit = (amount: number, roiPercentage: number) => {
    return (amount * roiPercentage) / 100;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-[#7c3aed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-sm font-semibold text-gray-500">Retrieving pool catalog...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Yield Pools</h1>
          <p className="text-sm font-light text-gray-500">Leverage quantitative strategies tailored to your timeline</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-tr from-purple-500/10 via-white to-blue-500/5 border border-purple-100 rounded-[28px] p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Available balance</span>
            <p className="font-syne text-3xl font-extrabold text-transparent bg-gradient-to-r from-[#4169e1] to-[#e040fb] bg-clip-text">
              {formatCurrency(userBalance)}
            </p>
          </div>
          {activePackage && (
            <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold uppercase tracking-wider px-3 rounded-full py-1">
              ✓ Active Allocation
            </Badge>
          )}
        </div>

        {/* Info Alert */}
        <div className="bg-[#f0eee9]/40 border border-purple-50 rounded-[28px] p-6 text-sm font-light text-gray-600 flex gap-4">
          <AlertCircle className="h-5 w-5 text-[#7c3aed] shrink-0" />
          <div className="space-y-1">
            <h4 className="font-syne font-bold text-gray-800 text-sm">How to Deploy Principal</h4>
            <p>Choose an allocation pool below, then navigate to the deposits page to finalize funding. Telemetry will calculate and credit yields to your ledger daily.</p>
          </div>
        </div>

        {/* Grid */}
        {packages.length === 0 ? (
          <div className="glass-panel rounded-[28px] p-12 text-center text-gray-400 font-light border border-purple-50">
            No active yield pools available currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => {
              const features = getPackageFeatures(pkg.name);
              const isPopular = index === 1;
              const isActive = activePackage === pkg._id;
              const minDailyProfit = calculateDailyProfit(pkg.minAmount, pkg.roiPercentage);
              const maxDailyProfit = calculateDailyProfit(pkg.maxAmount, pkg.roiPercentage);
              
              return (
                <div 
                  key={pkg._id} 
                  className={`relative glass-panel rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-3 hover:shadow-xl ${
                    isActive ? 'ring-2 ring-emerald-500/20 bg-white border-emerald-300' : 'border-purple-50'
                  }`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-[#7c3aed] to-[#e040fb] text-white border-none font-bold text-[10px] tracking-wider rounded-full py-0.5 px-3">
                      Most Popular
                    </Badge>
                  )}

                  {isActive && (
                    <Badge className="absolute -top-3 right-6 bg-emerald-500 text-white border-none font-bold text-[10px] tracking-wider rounded-full py-0.5 px-3">
                      ✓ Active
                    </Badge>
                  )}

                  <div className="mb-6 pt-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Yield Tier</span>
                    <h3 className="font-syne text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                    <div>
                      <span className="font-syne text-5xl font-extrabold text-transparent bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] bg-clip-text">
                        {pkg.roiPercentage}%
                      </span>
                      <span className="text-xs text-gray-400 font-bold tracking-wider block mt-1 uppercase">Daily ROI accrued</span>
                    </div>
                  </div>

                  {/* Range card */}
                  <div className="bg-[#f8f7f5] rounded-2xl p-4 border border-purple-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Limits</span>
                      <DollarSign className="h-4 w-4 text-[#7c3aed]" />
                    </div>
                    <p className="font-syne font-bold text-gray-800 text-lg">
                      {formatCurrency(pkg.minAmount)} - {formatCurrency(pkg.maxAmount)}
                    </p>
                    <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                      <span>Daily: {formatCurrency(minDailyProfit)}</span>
                      <span>to {formatCurrency(maxDailyProfit)}</span>
                    </div>
                  </div>

                  {/* Lockup */}
                  <div className="flex items-center justify-between p-3.5 bg-[#f8f7f5] rounded-2xl border border-purple-50 my-4 text-xs font-semibold text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#7c3aed]" />
                      <span>Lockup Period</span>
                    </div>
                    <span className="text-gray-850 font-bold">{pkg.durationDays} Days</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pt-2 mb-6">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pool benefits</span>
                    <ul className="space-y-2">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-600 font-light">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] hover:opacity-90 text-white font-semibold shadow-md border-none"
                    onClick={() => handleInvestNow(pkg)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {isActive ? 'Invest More' : 'Allocate Principal'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}