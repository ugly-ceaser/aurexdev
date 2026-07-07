'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, Mail, Wallet, DollarSign, TrendingUp, TrendingDown, 
  Shield, Calendar, ArrowLeft, Key, AlertCircle, CheckCircle, Copy 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface UserDetails {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    walletAddress: string;
    balance: number;
    isBlocked: boolean;
    emailVerified: boolean;
    requestedCardWaitlist?: boolean;
    createdAt: string;
    updatedAt: string;
    passwordHash: string;
  };
  statistics: {
    totalDeposits: number;
    approvedDeposits: number;
    pendingDeposits: number;
    totalWithdrawals: number;
    approvedWithdrawals: number;
    pendingWithdrawals: number;
    totalProfits: number;
    netPosition: number;
    activePackage: string | null;
  };
  recentActivity: {
    deposits: any[];
    withdrawals: any[];
    profits: any[];
  };
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserDetails(data);
      } else {
        setError('Failed to load user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Error loading user details');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setError('');
    setMessage('');
    setTempPassword('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsResetting(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage('Password reset successfully! Email sent to user.');
        setTempPassword(data.temporaryPassword);
        setNewPassword('');
        setTimeout(() => setMessage(''), 5000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to reset password');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Error resetting password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsResetting(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setMessage('Password copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading user details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userDetails) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg">User not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { user, statistics, recentActivity } = userDetails;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">User Details</h1>
              <p className="text-gray-400 mt-1">{user.name}</p>
            </div>
          </div>
          <Badge variant={user.isBlocked ? 'destructive' : 'default'}>
            {user.isBlocked ? 'Blocked' : 'Active'}
          </Badge>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Balance</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(user.balance)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(statistics.totalDeposits)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(statistics.totalWithdrawals)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Profits</p>
                  <p className="text-2xl font-bold text-purple-400">{formatCurrency(statistics.totalProfits)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-yellow-500" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-white font-mono text-sm">{user._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white">{user.email}</p>
                    {user.emailVerified && (
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <Badge className="capitalize">{user.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Wallet Address</p>
                  <p className="text-white font-mono text-sm break-all">{user.walletAddress || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Virtual USD Card Waitlist</p>
                  <Badge variant={user.requestedCardWaitlist ? 'default' : 'secondary'} className={user.requestedCardWaitlist ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}>
                    {user.requestedCardWaitlist ? 'Joined Waitlist' : 'Not Requested'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Password Hash (partial)</p>
                  <p className="text-gray-500 font-mono text-xs">{user.passwordHash}</p>
                  <p className="text-xs text-gray-600 mt-1">⚠️ Passwords are hashed and cannot be decrypted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-yellow-500" />
                Reset User Password
              </CardTitle>
              <CardDescription>
                Reset this user&apos;s password. They will receive an email with the new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newPassword"
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateRandomPassword}
                      title="Generate random password"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Minimum 6 characters</p>
                </div>

                {tempPassword && (
                  <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">New Password:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-white font-mono bg-gray-800 px-3 py-2 rounded flex-1">
                        {tempPassword}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyPassword}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ✓ Email sent to user with new password
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  disabled={isResetting}
                >
                  {isResetting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">Approved Deposits</p>
                <p className="text-lg font-bold text-white">{formatCurrency(statistics.approvedDeposits)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending Deposits</p>
                <p className="text-lg font-bold text-yellow-400">{formatCurrency(statistics.pendingDeposits)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Approved Withdrawals</p>
                <p className="text-lg font-bold text-white">{formatCurrency(statistics.approvedWithdrawals)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending Withdrawals</p>
                <p className="text-lg font-bold text-yellow-400">{formatCurrency(statistics.pendingWithdrawals)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Net Position</p>
                <p className={`text-lg font-bold ${statistics.netPosition >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(statistics.netPosition)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Package</p>
                <p className="text-lg font-bold text-white">{statistics.activePackage || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
