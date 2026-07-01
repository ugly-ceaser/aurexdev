'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ChevronLeft, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    walletAddress: '',
    coinType: '',
    transferNetwork: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#f8f7f5] text-[#0f0e0d]">
        <div className="w-full max-w-md relative z-10">
          <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] opacity-10 blur-xl" />
          <div className="relative glass-panel-heavy rounded-[32px] p-8 text-center shadow-2xl space-y-6">
            <div className="inline-flex h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full items-center justify-center text-3xl shadow-md border border-emerald-100 mx-auto">
              ✓
            </div>
            <h2 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Account Created!</h2>
            <p className="text-sm font-light text-gray-500">
              Welcome to Aurex Capital. Redirecting to authorization portal...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#f8f7f5] text-[#0f0e0d]">
      
      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10 my-12">
        
        {/* Glow overlay */}
        <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] opacity-10 blur-xl" />

        <div className="relative glass-panel-heavy rounded-[32px] p-8 shadow-2xl">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] items-center justify-center shadow-lg mx-auto">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">
              Create Account
            </h2>
            <p className="text-sm font-light text-gray-400">
              Join Aurex Capital and begin auto-accruing yields
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/30 text-rose-600">
                {error}
              </div>
            )}
            
            <div className="space-y-2 text-left">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm focus-visible:ring-purple-200"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm focus-visible:ring-purple-200"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm focus-visible:ring-purple-200"
              />
            </div>
            
            <div className="space-y-4 pt-2 border-t border-purple-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Withdrawal Destination (Optional)</span>
              
              <div className="space-y-2 text-left">
                <Label htmlFor="walletAddress" className="text-xs font-bold uppercase tracking-wider text-gray-400">Wallet Address (Optional)</Label>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5..."
                  className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm focus-visible:ring-purple-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2 text-left">
                  <Label htmlFor="coinType" className="text-xs font-bold uppercase tracking-wider text-gray-400">Coin Type (Optional)</Label>
                  <select
                    id="coinType"
                    name="coinType"
                    value={formData.coinType}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-purple-100 bg-white/50 py-3.5 px-4 text-sm focus-visible:ring-purple-200 outline-none text-gray-700 font-semibold"
                  >
                    <option value="">Select Coin</option>
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="transferNetwork" className="text-xs font-bold uppercase tracking-wider text-gray-400">Network (Optional)</Label>
                  <select
                    id="transferNetwork"
                    name="transferNetwork"
                    value={formData.transferNetwork}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-purple-100 bg-white/50 py-3.5 px-4 text-sm focus-visible:ring-purple-200 outline-none text-gray-700 font-semibold"
                  >
                    <option value="">Select Network</option>
                    <option value="TRC20">TRC20 (Tron)</option>
                    <option value="ERC20">ERC20 (Ethereum)</option>
                    <option value="BEP20">BEP20 (BSC)</option>
                    <option value="Bitcoin">Bitcoin (Native)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95 transition-opacity mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Initializing security...
                </span>
              ) : 'Register Account'}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-purple-50 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Already have an account?{' '}
              <Link href="/auth/forgot-password" />
              <Link href="/auth/login" className="text-[#7c3aed] font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}