'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserPlus, Sparkles, AlertCircle, CheckCircle2, Loader2, Key } from 'lucide-react';

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    wallet: '',
    secret: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Admin registered successfully.');
        setForm({ name: '', email: '', password: '', wallet: '', secret: '' });
      } else {
        setMessage(data?.error || 'Registration failed.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left max-w-2xl">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Create Administrator</h1>
          <p className="text-sm font-light text-gray-500">Provision a new administrator account with full platform permissions</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`px-4 py-3 rounded-2xl text-xs font-semibold border ${
            message.includes('successfully') 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' 
              : 'bg-red-500/10 border-red-500/30 text-rose-600'
          } flex items-center gap-2`}>
            {message.includes('successfully') ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message}
          </div>
        )}

        {/* Card wrapper */}
        <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-syne text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#7c3aed]" />
              Operator Credentials
            </h3>
            <Sparkles className="h-5 w-5 text-[#7c3aed]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Operator Name..."
                  className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="operator@aurexcapital.com"
                  className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-xs font-bold uppercase tracking-wider text-gray-400">USDT Wallet Address</Label>
                <Input
                  id="wallet"
                  name="wallet"
                  type="text"
                  value={form.wallet}
                  onChange={handleChange}
                  placeholder="Enter crypto address..."
                  className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm font-mono text-xs focus-visible:ring-purple-200"
                  required
                />
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="secret" className="text-xs font-bold uppercase tracking-wider text-gray-400">System Admin Secret Key</Label>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  id="secret"
                  name="secret"
                  type="text"
                  value={form.secret}
                  onChange={handleChange}
                  placeholder="Provide registration secret key..."
                  className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-10 pr-4 text-sm focus-visible:ring-purple-200"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authorizing provisioning...
                </span>
              ) : 'Register Administrator'}
            </Button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
