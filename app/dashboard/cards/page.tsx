'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, Shield, Zap, Globe, Coins, MonitorPlay, 
  ShoppingBag, CheckCircle, Loader2, Info
} from 'lucide-react';

export default function VirtualCardsPage() {
  const { data: session } = useSession();
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Set fallback user name from session
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
    fetchWaitlistStatus();
  }, [session]);

  const fetchWaitlistStatus = async () => {
    try {
      // 1. Fetch waitlist status
      const waitlistRes = await fetch('/api/dashboard/waitlist');
      if (waitlistRes.ok) {
        const data = await waitlistRes.json();
        setIsJoined(data.joined);
      }

      // 2. Fetch full profile details (to get dynamic name if session is partial)
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.name) {
          setUserName(profileData.name);
        }
      }
    } catch (err) {
      console.error('Error fetching card telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/waitlist', {
        method: 'POST',
      });
      if (res.ok) {
        setIsJoined(true);
      }
    } catch (err) {
      console.error('Error joining waitlist:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: CreditCard,
      title: 'Spend Crypto Like Cash',
      desc: 'Use your crypto balance for everyday online purchases without moving funds between multiple platforms.',
      color: 'text-blue-500 bg-blue-50/50 border-blue-100'
    },
    {
      icon: Globe,
      title: 'Global Payments',
      desc: 'Shop and pay on millions of Visa and Mastercard compatible websites worldwide.',
      color: 'text-purple-500 bg-purple-50/50 border-purple-100'
    },
    {
      icon: Zap,
      title: 'Instant Card Funding',
      desc: 'Top up your card directly from your crypto wallet in seconds.',
      color: 'text-amber-500 bg-amber-50/50 border-amber-100'
    },
    {
      icon: Coins,
      title: 'Automatic Conversion',
      desc: 'Supported cryptocurrencies are converted into fiat dynamically at the point of funding.',
      color: 'text-emerald-500 bg-emerald-50/50 border-emerald-100'
    },
    {
      icon: Shield,
      title: 'Secure Spending',
      desc: 'Keep your primary crypto safely stored in your vault while spending through a secure virtual card.',
      color: 'text-rose-500 bg-rose-50/50 border-rose-100'
    },
    {
      icon: Globe,
      title: 'Works Internationally',
      desc: 'No international merchant restrictions. Transact in USD globally with low conversion fees.',
      color: 'text-cyan-500 bg-cyan-50/50 border-cyan-100'
    }
  ];

  const shoppingMerchants = ['Amazon', 'AliExpress', 'Temu', 'eBay', 'Target', 'Walmart'];
  const streamingMerchants = ['Netflix', 'Spotify', 'YouTube Premium', 'Disney+', 'Apple Music', 'Prime Video'];

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-none font-bold uppercase tracking-wider rounded-full px-4 py-1 mb-2">
            Coming Soon
          </Badge>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Virtual USD Cards</h1>
          <p className="text-sm font-light text-gray-500">Spend crypto directly from your portfolio balance for online purchases</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#7c3aed]" />
            <span className="text-xs font-semibold text-gray-500 font-mono">Initializing card telemetry...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Card Preview & Waitlist Widget */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col items-center">
                
                {/* 3D Virtual Card Container */}
                <div className="relative w-full max-w-[340px] xs:max-w-[380px] aspect-[1.586/1] rounded-2xl p-6 text-white overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(124,58,237,0.2)] bg-gradient-to-br from-[#12131c] via-[#231b3e] to-[#0c051a] border border-white/10 flex flex-col justify-between select-none">
                  {/* Grid overlay glow lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,58,237,0.15),transparent)] pointer-events-none" />
                  
                  {/* Top row */}
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#7c3aed] font-bold">Aurex Capital</span>
                      <div className="text-xs font-bold font-syne tracking-tight">Virtual Visa</div>
                    </div>
                    {/* Wireless Pay Symbol */}
                    <svg className="w-6 h-6 text-white/50 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 8a4 4 0 0 1 0 8M8 6a7 7 0 0 1 0 12M11 4a10 10 0 0 1 0 16" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Chip and Numbers */}
                  <div className="space-y-4 relative z-10">
                    {/* Golden metallic chip */}
                    <div className="w-10 h-8 rounded bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border border-amber-600/30 flex flex-col justify-between p-1 shadow">
                      <div className="w-full h-[1px] bg-amber-600/20" />
                      <div className="w-full h-[1px] bg-amber-600/20" />
                      <div className="w-full h-[1px] bg-amber-600/20" />
                    </div>

                    {/* Masked Card Numbers */}
                    <div className="text-lg font-mono tracking-[0.25em] text-white/95">
                      4111 8800 **** 2026
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex justify-between items-end relative z-10">
                    <div className="space-y-0.5">
                      <div className="text-[8px] uppercase tracking-wider text-white/40">Cardholder</div>
                      <div className="text-xs font-semibold font-mono uppercase tracking-wide truncate max-w-[180px]">
                        {userName || 'VALUED INVESTOR'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className="bg-purple-500/20 text-[#a855f7] border border-purple-500/40 text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full mb-1">
                        Waitlist Priority
                      </Badge>
                      <div className="text-[8px] uppercase tracking-wider text-white/40 font-mono">Visa Debit</div>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-purple-50 w-full my-6" />

                {/* Waitlist widget */}
                <div className="w-full space-y-4 text-center">
                  <div className="text-sm text-gray-700 font-medium">
                    {isJoined ? 'You are on the Waitlist!' : 'Request Your Virtual USD Card'}
                  </div>
                  <p className="text-xs font-light text-gray-500 leading-relaxed px-2">
                    {isJoined 
                      ? 'Congratulations! You have secured priority access. We will notify you via email as soon as virtual card issuance begins.'
                      : 'Join the waiting list today to get priority access and zero-activation fees when we launch this service.'}
                  </p>

                  {isJoined ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-center gap-2.5 text-emerald-700 text-xs font-bold shadow-sm">
                      <CheckCircle className="h-5 w-5 shrink-0" />
                      Queue Status: Confirmed Priority
                    </div>
                  ) : (
                    <Button
                      className="w-full rounded-2xl py-6 font-bold bg-[#7c3aed] hover:bg-[#6b2fd5] text-white shadow-md shadow-purple-100 border-none transition-all duration-300"
                      disabled={submitting}
                      onClick={handleJoinWaitlist}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Securing Access...
                        </>
                      ) : (
                        'Request Card Access'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Card Benefits & Supported Services */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Why You'll Want One */}
              <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
                <h3 className="font-syne text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#7c3aed]" />
                  Card Benefits & Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, i) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={i} className="flex gap-4 p-4 hover:bg-purple-50/10 rounded-2xl transition-all duration-300">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${benefit.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-syne font-bold text-gray-800 text-sm">{benefit.title}</h4>
                          <p className="text-xs font-light text-gray-500 leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Supported Platforms (Perfect For) */}
              <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 space-y-6">
                <h3 className="font-syne text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#7c3aed]" />
                  Perfect For Subscription & Checkout
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shopping */}
                  <div className="space-y-3">
                    <h4 className="font-syne text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <ShoppingBag className="h-4.5 w-4.5" />
                      Shopping Platforms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {shoppingMerchants.map((merchant, idx) => (
                        <Badge key={idx} variant="secondary" className="rounded-xl px-3 py-1 font-semibold text-xs text-gray-600 bg-gray-50 border border-purple-50">
                          {merchant}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Streaming */}
                  <div className="space-y-3">
                    <h4 className="font-syne text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <MonitorPlay className="h-4.5 w-4.5" />
                      Streaming & Digital
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {streamingMerchants.map((merchant, idx) => (
                        <Badge key={idx} variant="secondary" className="rounded-xl px-3 py-1 font-semibold text-xs text-gray-600 bg-gray-50 border border-purple-50">
                          {merchant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
