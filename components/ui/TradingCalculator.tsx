'use client';

import { useState, useEffect } from 'react';
import { Percent, Scale, ShieldAlert, PieChart, Calculator, Landmark, ArrowRight, Coins } from 'lucide-react';
import Link from 'next/link';

interface Package {
  name: string;
  minAmount: number;
  maxAmount: number;
  roiPercentage: number;
  durationDays: number;
}

interface TradingCalculatorProps {
  packages?: Package[];
}

interface PairConfig {
  name: string;
  pipSize: number;
  contractSize: number;
  defaultPipValue: number;
}

const PAIR_CONFIGS: Record<string, PairConfig> = {
  'EUR/USD': { name: 'EUR/USD', pipSize: 0.0001, contractSize: 100000, defaultPipValue: 10 },
  'GBP/USD': { name: 'GBP/USD', pipSize: 0.0001, contractSize: 100000, defaultPipValue: 10 },
  'USD/JPY': { name: 'USD/JPY', pipSize: 0.01, contractSize: 100000, defaultPipValue: 10 },
  'AUD/USD': { name: 'AUD/USD', pipSize: 0.0001, contractSize: 100000, defaultPipValue: 10 },
  'BTC/USD': { name: 'BTC/USD', pipSize: 1.0, contractSize: 1, defaultPipValue: 1 },
};

const DEFAULT_PACKAGES: Package[] = [
  { name: 'Starter Pool', minAmount: 100, maxAmount: 2999, roiPercentage: 2.0, durationDays: 30 },
  { name: 'Professional Pool', minAmount: 3000, maxAmount: 9999, roiPercentage: 2.5, durationDays: 60 },
  { name: 'Zenith Pool', minAmount: 10000, maxAmount: 250000, roiPercentage: 3.0, durationDays: 90 },
];

export default function TradingCalculator({ packages = [] }: TradingCalculatorProps) {
  const [activeTab, setActiveTab] = useState<'investment' | 'position' | 'pl'>('investment');

  // Active packages list (falls back to defaults if API list is empty)
  const activePackages = packages.length > 0 ? packages : DEFAULT_PACKAGES;

  // Calculator 1: Investment Calculator
  const [deposit, setDeposit] = useState<number>(5000);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [dailyProfit, setDailyProfit] = useState<number>(0);
  const [weeklyProfit, setWeeklyProfit] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [totalPayout, setTotalPayout] = useState<number>(0);

  // Calculator 2: Position Size
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<number>(1.1000);
  const [stopLoss, setStopLoss] = useState<number>(1.0950);
  const [posPair, setPosPair] = useState<string>('EUR/USD');
  const [posPipValue, setPosPipValue] = useState<number>(10);

  // Position Results
  const [riskAmount, setRiskAmount] = useState<number>(200);
  const [stopLossPips, setStopLossPips] = useState<number>(50);
  const [calculatedLots, setCalculatedLots] = useState<string>('0.40');
  const [showPosResult, setShowPosResult] = useState<boolean>(true);

  // Calculator 3: Profit / Loss
  const [lots, setLots] = useState<number>(0.1);
  const [plEntry, setPlEntry] = useState<number>(1.1000);
  const [plExit, setPlExit] = useState<number>(1.1050);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [plPair, setPlPair] = useState<string>('EUR/USD');
  const [plPipValue, setPlPipValue] = useState<number>(10);

  // P&L Results
  const [plProfit, setPlProfit] = useState<number>(50);
  const [plPips, setPlPips] = useState<number>(50);
  const [plRoi, setPlRoi] = useState<string>('4.55');
  const [showPlResult, setShowPlResult] = useState<boolean>(true);

  // Auto-update Investment Calculations
  useEffect(() => {
    // Find matching package based on deposit amount
    const matched = activePackages.find(
      (pkg) => deposit >= pkg.minAmount && deposit <= pkg.maxAmount
    ) || activePackages[activePackages.length - 1]; // Fallback to highest tier if above limits

    if (matched) {
      setSelectedPkg(matched);
      const daily = deposit * (matched.roiPercentage / 100);
      const weekly = daily * 7;
      const total = daily * matched.durationDays;
      setDailyProfit(daily);
      setWeeklyProfit(weekly);
      setTotalProfit(total);
      setTotalPayout(deposit + total);
    } else {
      setSelectedPkg(null);
    }
  }, [deposit, activePackages]);

  // Auto-update values on currency change for Position Calculator
  useEffect(() => {
    const config = PAIR_CONFIGS[posPair];
    if (config) {
      setPosPipValue(config.defaultPipValue);
      if (posPair === 'USD/JPY') {
        setEntryPrice(149.82);
        setStopLoss(148.50);
      } else if (posPair === 'BTC/USD') {
        setEntryPrice(65000);
        setStopLoss(64000);
      } else {
        setEntryPrice(1.1000);
        setStopLoss(1.0950);
      }
    }
  }, [posPair]);

  // Auto-update values on currency change for P&L Calculator
  useEffect(() => {
    const config = PAIR_CONFIGS[plPair];
    if (config) {
      setPlPipValue(config.defaultPipValue);
      if (plPair === 'USD/JPY') {
        setPlEntry(149.82);
        setPlExit(151.20);
      } else if (plPair === 'BTC/USD') {
        setPlEntry(65000);
        setPlExit(66000);
      } else {
        setPlEntry(1.1000);
        setPlExit(1.1050);
      }
    }
  }, [plPair]);

  const handleCalculatePosition = () => {
    const config = PAIR_CONFIGS[posPair];
    const risk = balance * (riskPercent / 100);
    const diff = Math.abs(entryPrice - stopLoss);
    const pips = diff / config.pipSize;
    
    let lotsVal = 0;
    if (pips > 0 && posPipValue > 0) {
      lotsVal = risk / (pips * posPipValue);
    }

    setRiskAmount(risk);
    setStopLossPips(Math.round(pips * 10) / 10);
    setCalculatedLots(lotsVal.toFixed(2));
    setShowPosResult(true);
  };

  const handleCalculatePL = () => {
    const config = PAIR_CONFIGS[plPair];
    const diff = tradeType === 'BUY' ? plExit - plEntry : plEntry - plExit;
    const pips = diff / config.pipSize;
    const profit = lots * pips * plPipValue;

    const nominalValue = lots * config.contractSize * plEntry;
    const margin = nominalValue * 0.10;
    
    let roiVal = 0;
    if (margin > 0) {
      roiVal = (profit / margin) * 100;
    }

    setPlProfit(Math.round(profit * 100) / 100);
    setPlPips(Math.round(pips * 10) / 10);
    setPlRoi(roiVal.toFixed(2));
    setShowPlResult(true);
  };

  return (
    <div className="space-y-10 w-full max-w-4xl mx-auto text-left">
      {/* Calculator Tab Selector */}
      <div className="flex justify-center mb-8 border border-gray-250/80 max-w-lg mx-auto p-1 bg-white/80 rounded-2xl shadow-sm relative overflow-visible">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ghostShiftRightCalc {
            0% { transform: translateX(0) scale(1); opacity: 0.4; }
            25%, 100% { transform: translateX(28px) scale(0.95); opacity: 0; }
          }
          @keyframes ghostShiftLeftCalc {
            0% { transform: translateX(0) scale(1); opacity: 0.4; }
            25%, 100% { transform: translateX(-28px) scale(0.95); opacity: 0; }
          }
          .animate-ghost-shift-right-calc {
            animation: ghostShiftRightCalc 3.5s infinite ease-in-out;
          }
          .animate-ghost-shift-left-calc {
            animation: ghostShiftLeftCalc 3.5s infinite ease-in-out;
          }
        `}} />
        <button
          onClick={() => setActiveTab('investment')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-visible ${
            activeTab === 'investment'
              ? 'bg-[#7c3aed] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {activeTab === 'investment' && (
            <div className="absolute inset-0 bg-[#7c3aed] rounded-xl pointer-events-none z-0 animate-ghost-shift-right-calc" />
          )}
          <span className="relative z-10">Investment ROI</span>
        </button>
        <button
          onClick={() => setActiveTab('position')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-visible ${
            activeTab === 'position'
              ? 'bg-[#7c3aed] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {activeTab === 'position' && (
            <div className="absolute inset-0 bg-[#7c3aed] rounded-xl pointer-events-none z-0 animate-ghost-shift-right-calc" />
          )}
          <span className="relative z-10">Position Size</span>
        </button>
        <button
          onClick={() => setActiveTab('pl')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-visible ${
            activeTab === 'pl'
              ? 'bg-[#7c3aed] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {activeTab === 'pl' && (
            <div className="absolute inset-0 bg-[#7c3aed] rounded-xl pointer-events-none z-0 animate-ghost-shift-left-calc" />
          )}
          <span className="relative z-10">Profit & Loss</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-250/30 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[460px] flex flex-col justify-between">
        
        {/* TAB 1: INVESTMENT ROI CALCULATOR */}
        {activeTab === 'investment' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-gray-900 leading-tight">
                  Yield Pool Investment Calculator
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  Calculate returns based on yield pool allocations and daily ROI rates
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Intended Deposit Amount ($)
                    </label>
                    <span className="font-mono font-bold text-lg text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                      ${deposit.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="100"
                    value={deposit}
                    onChange={(e) => setDeposit(parseInt(e.target.value) || 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7c3aed]"
                  />
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span>MIN: $100</span>
                    <span>MAX: $50,000+</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Or Enter Deposit Manually
                  </label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Results & Package Telemetry */}
              <div className="bg-[#f0eee9]/40 border border-gray-200/50 rounded-2xl p-6 space-y-5">
                {selectedPkg && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Matching Pool
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7c3aed]/10 text-[#7c3aed] uppercase border border-[#7c3aed]/20">
                        {selectedPkg.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/80 border border-gray-100 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">
                          Daily ROI
                        </span>
                        <span className="font-syne font-extrabold text-[#7c3aed] text-lg">
                          {selectedPkg.roiPercentage}%
                        </span>
                      </div>
                      <div className="bg-white/80 border border-gray-100 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">
                          Lockup Period
                        </span>
                        <span className="font-syne font-extrabold text-[#7c3aed] text-lg">
                          {selectedPkg.durationDays} Days
                        </span>
                      </div>
                    </div>

                    <div className="h-[1px] bg-gray-200" />

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                        <span>Daily Returns</span>
                        <strong className="text-gray-900">${dailyProfit.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                        <span>Weekly Returns</span>
                        <strong className="text-gray-900">${weeklyProfit.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600 border-t border-dashed border-gray-200 pt-2.5">
                        <span>Total Profit Yield</span>
                        <strong className="text-emerald-600">${totalProfit.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                        <span>Total Payout (Principal + Profit)</span>
                        <strong className="text-[#7c3aed] text-sm">${totalPayout.toFixed(2)}</strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-[11px] text-gray-400 font-medium max-w-md">
                ROI calculations are based on live telemetry yield records. Yield payments accrue automatically every morning.
              </span>
              <Link href="/auth/register" className="w-full sm:w-auto shrink-0">
                <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-amber-500/10 flex items-center justify-center gap-1 text-sm w-full">
                  Deploy Deposit <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: POSITION SIZE CALCULATOR */}
        {activeTab === 'position' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-gray-900 leading-tight">
                  Position Size Calculator
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  Manage your risk per trade scientifically
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Account Balance ($)
                  </label>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Risk Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Currency Pair
                  </label>
                  <select
                    value={posPair}
                    onChange={(e) => setPosPair(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  >
                    {Object.keys(PAIR_CONFIGS).map((pair) => (
                      <option key={pair} value={pair}>
                        {pair}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Pip Value ($)
                  </label>
                  <input
                    type="number"
                    value={posPipValue}
                    onChange={(e) => setPosPipValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Output Display */}
              <div className="bg-[#f0eee9]/40 border border-gray-200/50 rounded-2xl p-6 flex flex-col justify-center min-h-[220px]">
                {showPosResult && (
                  <div className="space-y-6 text-center">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white border border-gray-150 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">
                          Risk Amount
                        </span>
                        <span className="font-syne font-bold text-gray-900 text-lg">
                          ${riskAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-white border border-gray-150 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">
                          Stop Loss
                        </span>
                        <span className="font-syne font-bold text-[#7c3aed] text-lg">
                          {stopLossPips} Pips
                        </span>
                      </div>
                      <div className="bg-white border border-gray-150 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">
                          Position Size
                        </span>
                        <span className="font-syne font-bold text-emerald-600 text-lg">
                          {calculatedLots} Lots
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCalculatePosition}
                      className="w-full bg-[#7c3aed] hover:bg-[#6b2fd5] text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-purple-200 text-sm flex items-center justify-center gap-2"
                    >
                      <Calculator className="h-4 w-4" /> Calculate Position
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFIT/LOSS CALCULATOR */}
        {activeTab === 'pl' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-gray-900 leading-tight">
                  Profit/Loss Calculator
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  Estimate yield projections and returns
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Position Size (Lots)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lots}
                    onChange={(e) => setLots(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={plEntry}
                    onChange={(e) => setPlEntry(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Exit Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={plExit}
                    onChange={(e) => setPlExit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Trade Type
                  </label>
                  <select
                    value={tradeType}
                    onChange={(e) => setTradeType(e.target.value as 'BUY' | 'SELL')}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  >
                    <option value="BUY">Buy (Long)</option>
                    <option value="SELL">Sell (Short)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Currency Pair
                  </label>
                  <select
                    value={plPair}
                    onChange={(e) => setPlPair(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  >
                    {Object.keys(PAIR_CONFIGS).map((pair) => (
                      <option key={pair} value={pair}>
                        {pair}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Pip Value ($)
                  </label>
                  <input
                    type="number"
                    value={plPipValue}
                    onChange={(e) => setPlPipValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Output Display */}
              <div className="bg-[#f0eee9]/40 border border-gray-200/50 rounded-2xl p-6 flex flex-col justify-center min-h-[220px]">
                {showPlResult && (
                  <div className="space-y-6 text-center">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white border border-gray-150 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">
                          Profit/Loss
                        </span>
                        <span className={`font-syne font-bold text-md ${plProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {plProfit >= 0 ? '+' : ''}${plProfit.toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-white border border-gray-150 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">
                          P&L Pips
                        </span>
                        <span className={`font-syne font-bold text-md ${plPips >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {plPips >= 0 ? '+' : ''}{plPips}
                        </span>
                      </div>
                      <div className="bg-white border border-gray-150 rounded-xl p-3">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">
                          ROI %
                        </span>
                        <span className={`font-syne font-bold text-md ${plProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {plProfit >= 0 ? '+' : ''}{plRoi}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCalculatePL}
                      className="w-full bg-[#4169e1] hover:bg-[#3558c8] text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-200 text-sm flex items-center justify-center gap-2"
                    >
                      <Calculator className="h-4 w-4" /> Calculate P&L
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Management Tips Row */}
      <div className="bg-[#fffbeb] border border-amber-200 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          <h4 className="font-syne text-md font-bold text-amber-900">
            Risk Management Guidelines
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tip 1 */}
          <div className="flex gap-3 text-left">
            <div className="h-9 w-9 rounded-full bg-rose-500 flex items-center justify-center shrink-0 text-white font-bold">
              <Percent className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-800 mb-1">Risk 1-2% Per Trade</h5>
              <p className="text-[11px] font-medium text-gray-500 leading-relaxed font-sans">
                Never risk more than 2% of your account balance on a single trade setup.
              </p>
            </div>
          </div>

          {/* Tip 2 */}
          <div className="flex gap-3 text-left">
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white font-bold">
              <Scale className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-800 mb-1">Risk-Reward Ratio</h5>
              <p className="text-[11px] font-medium text-gray-500 leading-relaxed font-sans">
                Aim for at least a 1:2 risk-to-reward ratio on all executions.
              </p>
            </div>
          </div>

          {/* Tip 3 */}
          <div className="flex gap-3 text-left">
            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white font-bold">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-800 mb-1">Always Use Stop Loss</h5>
              <p className="text-[11px] font-medium text-gray-500 leading-relaxed font-sans">
                Protect your account equity with firm stop-loss parameters.
              </p>
            </div>
          </div>

          {/* Tip 4 */}
          <div className="flex gap-3 text-left">
            <div className="h-9 w-9 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 text-white font-bold">
              <PieChart className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-800 mb-1">Diversify Positions</h5>
              <p className="text-[11px] font-medium text-gray-500 leading-relaxed font-sans">
                Never over-allocate capital into a single asset or currency cross.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
