'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CryptoMarketWidget from '@/components/ui/CryptoMarketWidget';
import ForexRatesWidget from '@/components/ui/ForexRatesWidget';
import {
  TrendingUp,
  Shield,
  Clock,
  Star,
  CheckCircle,
  BarChart3,
  LogOut,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  ArrowUpRight,
  Database
} from 'lucide-react';

interface Package {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roiPercentage: number;
  durationDays: number;
  isActive: boolean;
}

export default function Home() {
  const { data: session } = useSession();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [cardPositions, setCardPositions] = useState([0, 1, 2, 3, 4]);
  const [featureCardPositions, setFeatureCardPositions] = useState([0, 1]);
  const [hoveredFeatureCard, setHoveredFeatureCard] = useState<number | null>(null);

  // Mouse hover perspective state
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleFeatureCardClick = (cardIndex: number) => {
    const currentSlot = featureCardPositions[cardIndex];
    if (currentSlot === 0) return; // Already in front

    const frontCardIdx = featureCardPositions.indexOf(0);
    const newPositions = [...featureCardPositions];
    newPositions[cardIndex] = 0;
    newPositions[frontCardIdx] = currentSlot;
    setFeatureCardPositions(newPositions);
  };

  const getFeatureCardClasses = (cardIndex: number) => {
    const slot = featureCardPositions[cardIndex];
    const isHovered = hoveredFeatureCard === cardIndex;
    const baseTransition = "absolute transition-all duration-500 ease-out cursor-pointer ";

    switch (slot) {
      case 0: // Front centered spot
        return baseTransition + "z-20 " + (isHovered ? "z-[60] scale-[1.04] shadow-2xl" : "");
      case 1: // Behind offset spot
        return baseTransition + "bottom-10 right-4 lg:right-10 z-10 " + (isHovered ? "z-[60] scale-110 translate-x-6 translate-y-6 shadow-2xl" : "");
      default:
        return baseTransition;
    }
  };

  const handleCardClick = (cardIndex: number) => {
    const currentSlot = cardPositions[cardIndex];
    if (currentSlot === 0) return; // Already in center

    const centerCardIdx = cardPositions.indexOf(0);
    const newPositions = [...cardPositions];
    newPositions[cardIndex] = 0;
    newPositions[centerCardIdx] = currentSlot;
    setCardPositions(newPositions);
  };

  const getCardClasses = (cardIndex: number) => {
    const slot = cardPositions[cardIndex];
    const isHovered = hoveredCard === cardIndex;
    const baseTransition = "absolute transition-all duration-500 ease-out cursor-pointer ";

    switch (slot) {
      case 0: // Center
        return baseTransition + "z-20 " + (isHovered ? "z-[60] scale-[1.04] shadow-2xl" : "");
      case 1: // Top-Left (Returns)
        return baseTransition + "top-16 left-4 lg:left-0 z-30 " + (isHovered ? "z-[60] scale-110 -translate-x-6 -translate-y-6" : "");
      case 2: // Top-Right (Daily ROI)
        return baseTransition + "top-10 right-4 lg:right-0 z-10 " + (isHovered ? "z-[60] scale-110 translate-x-6 -translate-y-6" : "");
      case 3: // Bottom-Left (Fund Security)
        return baseTransition + "bottom-20 left-4 lg:left-0 z-30 " + (isHovered ? "z-[60] scale-110 -translate-x-6 translate-y-6" : "");
      case 4: // Bottom-Right (AUM)
        return baseTransition + "bottom-16 right-4 lg:right-0 z-10 " + (isHovered ? "z-[60] scale-110 translate-x-6 translate-y-6" : "");
      default:
        return baseTransition;
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroVisualRef.current) return;
    const rect = heroVisualRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 15;
    const y = (e.clientY - rect.top - rect.height / 2) / 15;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Features list mapping
  const coreFeatures = [
    {
      icon: Sparkles,
      title: 'Neural Asset Trading',
      description: 'Advanced machine learning models scan historical order books and current order flow 24/7.',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: Zap,
      title: 'Instant Daily Earnings',
      description: 'Accrued yields are calculated and credited automatically to your portfolio ledger every day.',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: Shield,
      title: 'Cinematic Vault Protection',
      description: 'Hedge insurance funds and institutional multi-signature wallets guard your capital base.',
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      icon: Database,
      title: 'Decentralized Ledgers',
      description: 'Real-time telemetry and API records ensure completely auditable and transparent performance.',
      color: 'bg-pink-500/10 text-pink-600'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8f7f5] text-[#0f0e0d]">

      {/* Floating Translucent Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-7xl glass-panel rounded-[32px] px-3 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] flex items-center justify-center shadow-md">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="font-syne text-xl font-bold tracking-tight bg-gradient-to-r from-[#4169e1] to-[#e040fb] bg-clip-text text-transparent hidden sm:inline-block">
            Aurex Capital
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#metrics" className="text-sm font-medium text-gray-600 hover:text-[#7c3aed] transition-colors">Metrics</a>
          <a href="#why" className="text-sm font-medium text-gray-600 hover:text-[#7c3aed] transition-colors">Platform</a>
          <a href="#packages" className="text-sm font-medium text-gray-600 hover:text-[#7c3aed] transition-colors">Yield Pools</a>
          <a href="#markets" className="text-sm font-medium text-gray-600 hover:text-[#7c3aed] transition-colors">Markets</a>
          <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-[#7c3aed] transition-colors">Reviews</a>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {session ? (
            <>
              <span className="text-xs text-gray-500 hidden sm:inline">Welcome, <strong className="text-gray-700">{session.user.name}</strong></span>
              <Link href={session.user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="outline" size="sm" className="rounded-full border-purple-200 hover:bg-purple-50 text-gray-700 text-xs sm:text-sm px-2.5 sm:px-4">
                  Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut} className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50/50">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#7c3aed] px-2 sm:px-3 py-1.5 transition-colors">
                Log In
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="rounded-full bg-gradient-to-r from-[#4169e1] to-[#7c3aed] hover:from-[#3558c8] hover:to-[#6b2fd5] text-white px-3 sm:px-5 shadow-md shadow-purple-200 border-none transition-all duration-300 text-xs sm:text-sm">
                  Start Earning
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side Content */}
        <div className="space-y-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-purple-100 rounded-full text-xs font-semibold text-[#7c3aed] shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#4169e1] to-[#e040fb] animate-pulse" />
            Next-Generation AI Investment Platform
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#0f0e0d] leading-[1.08] lg:max-w-xl">
            Secure Wealth. <br />
            Built for Life.
          </h1>

          <p className="text-lg md:text-xl font-light text-[#4a4844] max-w-lg leading-relaxed">
            A modern investment platform focused on long-term growth, financial stability, and peace of mind.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#packages">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white font-medium px-8 py-6 text-md shadow-xl shadow-purple-200/50 hover:opacity-95 transition-all duration-300 border-none">
                Start Earning Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#why">
              <Button size="lg" variant="outline" className="rounded-full bg-white/70 border-purple-100 text-gray-700 hover:bg-white px-8 py-6 text-md shadow-sm backdrop-blur-md">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200/60 lg:max-w-md">
            <div className="flex -space-x-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4169e1] to-purple-400 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">SJ</div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">MC</div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">ED</div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4169e1] to-cyan-400 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">AK</div>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Trusted by <strong className="text-gray-900">12,400+</strong> global accumulators
            </p>
          </div>
        </div>

        {/* Right Side Immersive 3D/Floating Dashboard Cards */}
        <div
          ref={heroVisualRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative h-[600px] w-full flex items-center justify-center cursor-pointer transition-transform duration-500 ease-out select-none"
          style={{
            transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
          }}
        >
          {/* Main Portfolio Card */}
          <div
            onClick={() => handleCardClick(0)}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`${getCardClasses(0)} w-full max-w-[360px] glass-panel-heavy rounded-[28px] p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Portfolio telemetry</span>
              <Badge className="bg-[#4169e1]/10 text-[#4169e1] border-none font-semibold px-3 rounded-full">Live</Badge>
            </div>

            <h3 className="font-syne text-4xl font-extrabold text-[#0f0e0d] tracking-tight mb-1">$124,830</h3>
            <p className="text-sm font-medium text-emerald-500 mb-6 flex items-center gap-1">
              <span>▲</span> +$3,241.50 today (2.67%)
            </p>

            {/* Sparkline Graph */}
            <svg className="w-full h-24 mb-6 overflow-visible" viewBox="0 0 280 80" fill="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4169e1" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#e040fb" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 65 C30 60 50 55 70 48 C90 41 110 52 130 38 C150 24 165 28 185 18 C205 8 225 20 250 12 C260 8 270 6 280 4"
                stroke="url(#chartGrad)"
                strokeWidth="3"
                fill="none"
                className="stroke-dasharray-500 stroke-dashoffset-500 animate-[drawLine_2.5s_ease_forwards]"
              />
              <path d="M0 65 C30 60 50 55 70 48 C90 41 110 52 130 38 C150 24 165 28 185 18 C205 8 225 20 250 12 C260 8 270 6 280 4 L280 80 L0 80Z" fill="url(#areaGrad)" />
            </svg>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">7-day ROI</span>
                <span className="font-syne font-bold text-[#22c55e] text-lg">+18.4%</span>
              </div>
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">30-day ROI</span>
                <span className="font-syne font-bold text-[#22c55e] text-lg">+62.1%</span>
              </div>
            </div>
          </div>

          {/* Floating Metric 1 */}
          <div
            onClick={() => handleCardClick(1)}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            className={getCardClasses(1)}
          >
            <div className="glass-panel rounded-2xl p-4 w-44 shadow-lg animate-float-a hover:border-purple-200">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">📈</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Returns</div>
              <div className="font-syne font-bold text-xl">+284%</div>
              <div className="text-[10px] font-medium text-emerald-500 mt-0.5">↑ 4.2% this week</div>
            </div>
          </div>

          {/* Floating Metric 2 */}
          <div
            onClick={() => handleCardClick(2)}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            className={getCardClasses(2)}
          >
            <div className="glass-panel rounded-2xl p-4 w-40 shadow-lg animate-float-b hover:border-purple-200">
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-lg mb-3">⚡</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Daily ROI</div>
              <div className="font-syne font-bold text-xl">+2.0%</div>
              <div className="text-[10px] font-medium text-emerald-500 mt-0.5">↑ Average yield</div>
            </div>
          </div>

          {/* Floating Metric 3 */}
          <div
            onClick={() => handleCardClick(3)}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            className={getCardClasses(3)}
          >
            <div className="glass-panel rounded-2xl p-4 w-44 shadow-lg animate-float-c hover:border-purple-200">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">🛡️</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Fund Security</div>
              <div className="font-syne font-bold text-xl">100%</div>
              <div className="text-[10px] font-medium text-emerald-500 mt-0.5">Vault insured</div>
            </div>
          </div>

          {/* Floating Metric 4 */}
          <div
            onClick={() => handleCardClick(4)}
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
            className={getCardClasses(4)}
          >
            <div className="glass-panel rounded-2xl p-4 w-40 shadow-lg animate-float-d hover:border-purple-200">
              <div className="h-9 w-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg mb-3">🏦</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Assets AUM</div>
              <div className="font-syne font-bold text-xl">$48M</div>
              <div className="text-[10px] font-medium text-gray-400 mt-0.5">Managed smart</div>
            </div>
          </div>
        </div>
      </section>

      {/* Endless Sliding Marquee */}
      <div className="relative py-6 overflow-hidden border-y border-purple-100 bg-white/40 backdrop-blur-md z-10">
        <div className="flex w-[200%] gap-12 animate-marquee">
          {[
            { t: 'BTC/USD', p: '$68,420.50', c: '+2.34%', pos: true },
            { t: 'ETH/USD', p: '$3,892.10', c: '+1.87%', pos: true },
            { t: 'SOL/USD', p: '$178.20', c: '+5.61%', pos: true },
            { t: 'AVAX/USD', p: '$42.80', c: '-0.55%', pos: false },
            { t: 'DOT/USD', p: '$7.45', c: '+1.12%', pos: true },
            { t: 'LINK/USD', p: '$16.90', c: '+2.67%', pos: true },
            { t: 'ADA/USD', p: '$0.48', c: '-1.45%', pos: false },
            { t: 'MATIC/USD', p: '$0.72', c: '+0.23%', pos: true }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 text-sm font-medium shrink-0">
              <span className="font-bold text-gray-800 uppercase">{item.t}</span>
              <span className="text-gray-600 font-mono">{item.p}</span>
              <span className={`text-xs ${item.pos ? 'text-emerald-500' : 'text-rose-500'} font-semibold`}>
                {item.c}
              </span>
            </div>
          ))}
          {[
            { t: 'BTC/USD', p: '$68,420.50', c: '+2.34%', pos: true },
            { t: 'ETH/USD', p: '$3,892.10', c: '+1.87%', pos: true },
            { t: 'SOL/USD', p: '$178.20', c: '+5.61%', pos: true },
            { t: 'AVAX/USD', p: '$42.80', c: '-0.55%', pos: false },
            { t: 'DOT/USD', p: '$7.45', c: '+1.12%', pos: true },
            { t: 'LINK/USD', p: '$16.90', c: '+2.67%', pos: true },
            { t: 'ADA/USD', p: '$0.48', c: '-1.45%', pos: false },
            { t: 'MATIC/USD', p: '$0.72', c: '+0.23%', pos: true }
          ].map((item, idx) => (
            <div key={`dup-${idx}`} className="flex items-center space-x-3 text-sm font-medium shrink-0">
              <span className="font-bold text-gray-800 uppercase">{item.t}</span>
              <span className="text-gray-600 font-mono">{item.p}</span>
              <span className={`text-xs ${item.pos ? 'text-emerald-500' : 'text-rose-500'} font-semibold`}>
                {item.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Section */}
      <section id="metrics" className="py-24 max-w-7xl mx-auto px-6 z-10 relative text-center">
        <div className="space-y-4 mb-16">
          <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-none font-bold uppercase tracking-wider rounded-full px-4 py-1">Platform Metrics</Badge>
          <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f0e0d] tracking-tight">
            Telemetry Performance <br />
            in <span className="bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] bg-clip-text text-transparent">Real-Time</span>
          </h2>
          <p className="text-gray-500 text-lg font-light max-w-lg mx-auto">
            Our autonomous software continuously calculates yields across liquid DeFi and arbitrage pools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { n: '$48,930,120', d: 'Total volume managed', i: '🏦', color: 'border-t-[#4169e1]' },
            { n: '12,400+', d: 'Global active members', i: '👥', color: 'border-t-[#7c3aed]' },
            { n: '30%', d: 'Maximum historical APY', i: '📈', color: 'border-t-[#e040fb]' },
            { n: '99.9%', d: 'Autonomous bot uptime', i: '⚡', color: 'border-t-[#00d4ff]' }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`glass-panel rounded-[24px] p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-t-2 ${item.color}`}
            >
              <div className="text-3xl mb-4">{item.i}</div>
              <h4 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight mb-2">{item.n}</h4>
              <p className="text-sm font-medium text-gray-400">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Yield Pools Section */}
      <section id="packages" className="py-24 bg-[#f0eee9]/40 border-y border-purple-100/60 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#e040fb]/10 text-[#e040fb] border-none font-bold uppercase tracking-wider rounded-full px-4 py-1">Yield pools</Badge>
            <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f0e0d] tracking-tight">
              Invest into <span className="bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] bg-clip-text text-transparent">AI Trading</span> Pools
            </h2>
            <p className="text-gray-500 text-lg font-light max-w-md mx-auto">
              Select an asset allocation pool built directly around your liquidity constraints and risk parameters.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-500 font-medium">Synchronizing yield pools...</div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No active yield pools available at the moment.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {packages.map((pkg, idx) => {
                const popular = idx === 1 || pkg.roiPercentage >= 20;
                return (
                  <div
                    key={pkg._id}
                    className={`relative glass-panel rounded-[28px] p-6 text-left transition-all duration-500 border hover:-translate-y-3 hover:shadow-2xl hover:border-purple-300 ${popular ? 'ring-2 ring-[#7c3aed]/20 shadow-md bg-white' : ''
                      }`}
                  >
                    {popular && (
                      <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-[#7c3aed] to-[#e040fb] text-white border-none font-bold text-[10px] tracking-wider rounded-full py-0.5 px-3">
                        Most Popular
                      </Badge>
                    )}

                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Autonomous</span>
                    <h3 className="font-syne text-xl font-bold text-gray-900 mb-4">{pkg.name}</h3>

                    <div className="mb-6">
                      <span className="font-syne text-5xl font-extrabold text-transparent bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] bg-clip-text">
                        {pkg.roiPercentage}%
                      </span>
                      <span className="text-xs text-gray-400 font-bold tracking-wider block mt-1 uppercase">Daily ROI accrued</span>
                    </div>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent my-4" />

                    <div className="space-y-4 mb-8">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Principal range</span>
                        <p className="font-bold text-gray-800 text-sm mt-0.5">
                          ${pkg.minAmount.toLocaleString()} - ${pkg.maxAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Lockup Period</span>
                        <p className="font-bold text-gray-850 text-sm mt-0.5">{pkg.durationDays} Days</p>
                      </div>
                    </div>

                    <Link href="/auth/register" className="block w-full">
                      <Button className={`w-full rounded-2xl py-6 font-semibold shadow-md ${popular
                        ? 'bg-gradient-to-r from-[#7c3aed] to-[#e040fb] hover:opacity-90 text-white border-none'
                        : 'bg-white hover:bg-gray-50 border border-purple-100 text-gray-700'
                        }`}>
                        Deploy Capital
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Platform Features */}
      <section id="why" className="py-24 max-w-7xl mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <Badge className="bg-[#4169e1]/10 text-[#4169e1] border-none font-bold uppercase tracking-wider rounded-full px-4 py-1">Platform Architecture</Badge>
            <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f0e0d] tracking-tight">
              Sovereign Asset <br />
              Optimization <span className="bg-gradient-to-r from-[#4169e1] to-[#7c3aed] bg-clip-text text-transparent">Engines</span>
            </h2>
            <p className="text-gray-500 font-light text-lg">
              Aurex Capital is built upon quantitative pipelines executing millisecond arbitrage trades across global cryptocurrency exchange matrices.
            </p>

            <div className="space-y-4 pt-4">
              {coreFeatures.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="flex gap-4 p-5 glass-panel rounded-2xl text-left border border-white/60 shadow-sm transition-all duration-300 hover:translate-x-2 hover:shadow-md cursor-pointer"
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-gray-800 text-md mb-1">{item.title}</h4>
                      <p className="text-sm font-light text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side Visual features */}
          <div className="relative h-[500px] w-full flex items-center justify-center">
            {/* Allocation donut card */}
            <div
              onClick={() => handleFeatureCardClick(0)}
              onMouseEnter={() => setHoveredFeatureCard(0)}
              onMouseLeave={() => setHoveredFeatureCard(null)}
              className={getFeatureCardClasses(0)}
            >
              <div className="w-full max-w-[300px] glass-panel-heavy rounded-[28px] p-6 shadow-2xl animate-float-a hover:border-purple-200">
                <h3 className="font-syne font-bold text-lg text-gray-900 mb-4 text-center">Liquidity Allocations</h3>
                <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                  {/* SVG Donut */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f3f5" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#chartGrad)" strokeWidth="3.2" strokeDasharray="65 35" strokeDashoffset="25" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-syne font-extrabold text-2xl text-gray-900 block">65%</span>
                    <span className="text-[9px] uppercase font-bold text-gray-400">Arbitrage</span>
                  </div>
                </div>

                {/* Bar Rows */}
                <div className="space-y-3">
                  {[
                    { n: 'Arbitrage', p: 65 },
                    { n: 'Options', p: 20 },
                    { n: 'Market Making', p: 15 }
                  ].map((bar, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-500 w-24">{bar.n}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full mx-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#4169e1] to-[#7c3aed] rounded-full" style={{ width: `${bar.p}%` }} />
                      </div>
                      <span className="font-bold text-gray-700 w-8 text-right">{bar.p}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Behind visual card */}
            <div
              onClick={() => handleFeatureCardClick(1)}
              onMouseEnter={() => setHoveredFeatureCard(1)}
              onMouseLeave={() => setHoveredFeatureCard(null)}
              className={getFeatureCardClasses(1)}
            >
              <div className="w-full max-w-[240px] glass-panel rounded-[24px] p-5 shadow-lg animate-float-b hover:border-purple-200 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">TELEMETRY SECURE</span>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold text-gray-700">Audit logs confirmed</span>
                </div>
                <p className="text-xs font-light text-gray-500">
                  All AI execution contracts are stamped and stored immutably to guarantee vault preservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Telemetry Section */}
      <section id="markets" className="py-24 bg-[#0a0a0c] text-white z-10 relative overflow-hidden border-t border-gray-800">
        {/* Ambient background glow blobs for dark mode operations terminal */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#4169e1]/10 blur-[120px] -top-20 -left-20 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#e040fb]/10 blur-[120px] bottom-10 right-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#7c3aed]/25 text-[#a855f7] border border-[#7c3aed]/40 font-bold uppercase tracking-wider rounded-full px-4 py-1">
              Live Operations
            </Badge>
            <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Global Market <span className="text-[#a855f7]">Telemetry</span>
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-lg mx-auto">
              Real-time asset telemetry streaming directly from global cryptocurrency exchanges and forex matrices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Cryptocurrency Markets Table */}
            <div className="lg:col-span-7 xl:col-span-8 group transition-all duration-500 h-full">
              <div className="bg-[#12131a]/90 backdrop-blur-xl border border-gray-850 rounded-[28px] p-6 shadow-2xl transition-all duration-300 hover:border-[#7c3aed]/40 hover:shadow-[0_0_50px_rgba(124,58,237,0.15)] h-full flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="font-syne text-xl font-bold text-white">Cryptocurrency Markets</h3>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-450 border border-emerald-550/20 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                    Live Data
                  </Badge>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-800/80 bg-[#0e1017] flex-1 flex flex-col">
                  <CryptoMarketWidget />
                </div>
              </div>
            </div>

            {/* Exchange Rates Matrix */}
            <div className="lg:col-span-5 xl:col-span-4 group transition-all duration-500 h-full">
              <div className="bg-[#12131a]/90 backdrop-blur-xl border border-gray-850 rounded-[28px] p-6 shadow-2xl transition-all duration-300 hover:border-[#7c3aed]/40 hover:shadow-[0_0_50px_rgba(124,58,237,0.15)] h-full flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                    <h3 className="font-syne text-xl font-bold text-white">Exchange Rates</h3>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-450 border border-blue-550/20 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                    Fiat Crosses
                  </Badge>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-800/80 bg-[#0e1017] flex-1 flex flex-col">
                  <ForexRatesWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-[#f0eee9]/20 border-t border-purple-100 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-none font-bold uppercase tracking-wider rounded-full px-4 py-1">Reviews</Badge>
            <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f0e0d] tracking-tight">
              Feedback from <span className="bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] bg-clip-text text-transparent">Our Investors</span>
            </h2>
            <p className="text-gray-500 text-lg font-light max-w-md mx-auto">
              Real telemetry reviews from members leveraging Aurex Capital for consistent passive income generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Passive Accumulator',
                content: 'Consistent daily ROI calculated and deposited automatically every single morning without fail. The glass-panel light UI is clean and feels premium.',
                avatar: 'SJ'
              },
              {
                name: 'Michael Chen',
                role: 'High Yield Arbitrageur',
                content: 'As an experienced fintech developer, I am thoroughly impressed by the speed and transparency of Aurex Capital yield pools. Unrivaled performance.',
                avatar: 'MC'
              },
              {
                name: 'Emma Davis',
                role: 'Hedge Fund Partner',
                content: 'Excellent vault infrastructure. Highly structured returns combined with robust capital preservation protocols make it a cornerstone of our passive assets.',
                avatar: 'ED'
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-[28px] p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-purple-200 relative overflow-hidden"
              >
                <div className="flex gap-1 text-yellow-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-[#4a4844] font-light text-md leading-relaxed mb-6 italic">&quot;{t.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#4169e1] to-[#7c3aed] text-white font-bold flex items-center justify-center text-xs shadow-md">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-gray-800 text-sm">{t.name}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 z-10 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[40px] p-6 sm:p-16 md:p-24 text-center shadow-xl relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-br from-[#4169e1]/5 via-[#7c3aed]/5 to-transparent z-0" />

            <div className="relative z-10 space-y-6">
              <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-none font-bold uppercase tracking-wider rounded-full px-4 py-1">Ready to start?</Badge>
              <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f0e0d] tracking-tight">
                Unlock Premium <br />
                Capital <span className="bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] bg-clip-text text-transparent">Appreciation</span>
              </h2>
              <p className="text-gray-500 font-light text-lg max-w-md mx-auto leading-relaxed">
                Configure your vault access now. Join Aurex Capital within minutes and accelerate your portfolio growth curve.
              </p>

              <div className="pt-6">
                <Link href="/auth/register" className="inline-block">
                  <Button size="lg" className="rounded-full bg-[#7c3aed] hover:bg-[#6b2fd5] text-white px-8 py-6 text-md font-semibold shadow-lg shadow-purple-200/40 border-none transition-all duration-300 w-auto inline-flex items-center justify-center">
                    Create Free Account
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 py-12 px-6 bg-white/40 backdrop-blur-md z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-syne text-lg font-bold tracking-tight bg-gradient-to-r from-[#4169e1] to-[#e040fb] bg-clip-text text-transparent">
              Aurex Capital
            </span>
          </div>

          <p className="text-xs text-gray-400 font-medium">
            © 2026 Aurex Capital. Secure Wealth. Infinite Possibilities
          </p>
        </div>
      </footer>
    </div>
  );
}