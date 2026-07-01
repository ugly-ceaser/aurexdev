'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, ChevronLeft, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying email credentials...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification security token is missing.');
      return;
    }
    fetch(`/api/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage('Email has been verified successfully! You can now access your telemetry.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Verification failed.');
      });
  }, [token]);

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

        <div className="relative glass-panel-heavy rounded-[32px] p-8 text-center shadow-2xl">
          <div className="space-y-4 mb-6">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] items-center justify-center shadow-lg mx-auto">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">
              Email Verification
            </h2>
            <p className="text-sm font-light text-gray-400">
              Aurex Capital secure onboarding telemetry
            </p>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-[24px] border text-sm font-medium flex flex-col items-center justify-center gap-4 ${
              status === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' 
                : status === 'error' 
                ? 'bg-red-500/10 border-red-500/30 text-rose-600' 
                : 'bg-purple-500/5 border-purple-100/50 text-gray-400'
            }`}>
              {status === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {status === 'error' && <AlertCircle className="h-10 w-10 text-rose-500" />}
              {status === 'pending' && (
                <svg className="animate-spin h-10 w-10 text-[#7c3aed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              )}
              <span className="text-center">{message}</span>
            </div>

            {status === 'success' && (
              <Link href="/auth/login" className="block w-full">
                <Button className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95 transition-opacity">
                  Sign In to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
