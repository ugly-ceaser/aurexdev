'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Wallet, Lock, Mail, Calendar, DollarSign, TrendingUp, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface UserProfile {
  name: string;
  email: string;
  walletAddress: string;
  balance: number;
  createdAt: string;
  role: string;
}

interface Stats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  activeInvestments: number;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({ totalDeposits: 0, totalWithdrawals: 0, totalProfits: 0, activeInvestments: 0 });
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name);
        setWalletAddress(data.walletAddress || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalDeposits: data.totalDeposits || 0,
          totalWithdrawals: data.totalWithdrawals || 0,
          totalProfits: data.totalProfits || 0,
          activeInvestments: data.approvedDeposits || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, walletAddress }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setMessage('Profile updated successfully!');
        await update();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('An error occurred while updating profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPassword(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoadingPassword(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoadingPassword(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to change password');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('An error occurred while changing password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const getAccountAge = () => {
    if (!profile?.createdAt) return 'N/A';
    const created = new Date(profile.createdAt);
    const now = new Date();
    const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Profile Settings</h1>
          <p className="text-sm font-light text-gray-500">Configure your credentials, payout address, and security vaults</p>
        </div>

        {/* Alerts */}
        {message && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {message}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/30 text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Mini stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { t: 'Available Balance', v: formatCurrency(profile?.balance || 0), i: DollarSign, color: 'text-blue-500 bg-blue-50 border-blue-100' },
            { t: 'Total Deposits', v: formatCurrency(stats.totalDeposits), i: TrendingUp, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
            { t: 'Total Profits', v: formatCurrency(stats.totalProfits), i: Sparkles, color: 'text-purple-500 bg-purple-50 border-purple-100' },
            { t: 'Account Age', v: getAccountAge(), i: Calendar, color: 'text-amber-500 bg-amber-50 border-amber-100' }
          ].map((card, idx) => {
            const Icon = card.i;
            return (
              <div key={idx} className="glass-panel rounded-[24px] p-6 border border-purple-50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{card.t}</span>
                  <p className="font-syne font-bold text-lg text-gray-800">{card.v}</p>
                </div>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Form sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Profile details */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            <div className="mb-6">
              <h3 className="font-syne text-xl font-bold text-gray-900">Profile Information</h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">Manage your personal identification parameters</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-10 pr-4 text-sm focus-visible:ring-purple-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="rounded-2xl border-purple-100 bg-gray-50 py-6 pl-10 pr-4 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-gray-450 font-light mt-1">Contact email cannot be changed for security</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddress" className="text-xs font-bold uppercase tracking-wider text-gray-400">Target Payout Wallet (BTC/USDT)</Label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="walletAddress"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-10 pr-4 text-sm font-mono focus-visible:ring-purple-200"
                    placeholder="Enter your BTC or USDT destination address"
                  />
                </div>
                <p className="text-[10px] text-gray-450 font-light mt-1">This address receives all principal/yield withdrawals</p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95 transition-opacity"
                disabled={isLoadingProfile}
              >
                {isLoadingProfile ? 'Updating details...' : 'Save Profile Settings'}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h3 className="font-syne text-xl font-bold text-gray-900">Security Parameters</h3>
                <p className="text-xs text-gray-400 font-light mt-0.5">Change password vault access key</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-10 pr-4 text-sm focus-visible:ring-purple-200"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-gray-400">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-10 pr-4 text-sm focus-visible:ring-purple-200"
                      placeholder="Min 6 alphanumeric characters"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-gray-400">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="rounded-2xl border-purple-100 bg-white/50 py-6 pl-10 pr-4 text-sm focus-visible:ring-purple-200"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95 transition-opacity"
                  disabled={isLoadingPassword}
                >
                  {isLoadingPassword ? 'Changing access key...' : 'Update Password Access'}
                </Button>
              </form>
            </div>

            {/* Tips list */}
            <div className="mt-6 pt-6 border-t border-purple-50">
              <h4 className="text-xs font-bold text-gray-800 mb-3">Security Guidelines</h4>
              <ul className="space-y-1.5 text-xs text-gray-500 font-light">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Maintain a password distinct from other services
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Double-check destination wallet coordinates before withdrawals
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Global info */}
        <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
          <h3 className="font-syne text-lg font-bold text-gray-900 mb-4">Metadata</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider block">Security status</span>
              <Badge className="bg-emerald-50 text-emerald-700 border-none font-semibold px-2 py-0.5 rounded-full mt-1">Active</Badge>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider block">Access Role</span>
              <Badge variant="outline" className="capitalize border-purple-100 text-gray-600 px-2 py-0.5 rounded-full mt-1">
                {profile?.role || 'User'}
              </Badge>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider block">Member since</span>
              <p className="font-semibold text-sm text-gray-700 mt-1">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
