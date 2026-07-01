'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminMailPage() {
  const [userId, setUserId] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject, html }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      setMessage('Email sent successfully!');
      setUserId('');
      setSubject('');
      setHtml('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left max-w-2xl">
        
        {/* Header */}
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Dispatch Email</h1>
          <p className="text-sm font-light text-gray-500">Send tailored notification bulletins directly to user email addresses</p>
        </div>

        {/* Alerts */}
        {message && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/30 text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Card Form */}
        <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-syne text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#7c3aed]" />
              Compose Bulletin
            </h3>
            <Sparkles className="h-5 w-5 text-[#7c3aed]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-xs font-bold uppercase tracking-wider text-gray-400">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Enter user MongoID..."
                className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200 font-mono text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Bullet subject title..."
                className="rounded-2xl border-purple-100 bg-white/50 py-5 px-4 text-sm focus-visible:ring-purple-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="html" className="text-xs font-bold uppercase tracking-wider text-gray-400">Message (HTML / Text)</Label>
              <textarea
                id="html"
                value={html}
                onChange={e => setHtml(e.target.value)}
                placeholder="Compose full content here..."
                className="w-full min-h-[160px] rounded-2xl border border-purple-100 bg-white/50 p-4 text-sm focus:ring-purple-200 outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl py-6 bg-gradient-to-r from-[#4169e1] via-[#7c3aed] to-[#e040fb] text-white border-none font-semibold shadow-lg shadow-purple-200 hover:opacity-95"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dispatching bulletin...
                </span>
              ) : 'Send Email Bulletin'}
            </Button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
