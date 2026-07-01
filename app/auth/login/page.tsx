'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ChevronLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please check your email and password.');
      } else {
        setError('');
        setTimeout(() => {
          setError('Login successful! Redirecting...');
        }, 300);
        // Get session to check role
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        setTimeout(() => {
          if (session?.user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/dashboard');
          }
        }, 1200);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#f8f7f5] text-[#0f0e0d]">
      
      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        
        {/* Glow overlay */}
        <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] opacity-10 blur-xl" />

        <div className="relative glass-panel-heavy rounded-[32px] p-8 shadow-2xl">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] items-center justify-center shadow-lg mx-auto">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm font-light text-gray-400">
              Access your premium Aurex Capital account telemetry
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className={`px-4 py-3 rounded-2xl text-xs font-semibold border ${
                error.includes('successful') 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' 
                  : 'bg-red-500/10 border-red-500/30 text-rose-600'
              }`}>
                {error}
              </div>
            )}
            
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm focus-visible:ring-purple-200"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="rounded-2xl border-purple-100 bg-white/50 py-6 px-4 text-sm focus-visible:ring-purple-200"
              />
            </div>
            
            <Button type="submit" className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95 transition-opacity" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Authorizing access...
                </span>
              ) : 'Sign In'}
            </Button>
            
            <div className="text-center pt-2">
              <Link href="/auth/forgot-password" className="text-xs font-bold text-[#7c3aed] hover:underline">
                Recover account credentials?
              </Link>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-purple-50 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-[#7c3aed] font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}