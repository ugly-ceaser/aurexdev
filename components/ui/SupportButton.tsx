'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

export default function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. CONSTANT FLOATING MOTION FIXED BUTTON */}
      <button
        onClick={() => {
          setIsOpen(true);
          setSuccess(false);
          setError('');
        }}
        className="fixed bottom-8 right-8 z-[45] h-14 w-14 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shadow-xl shadow-purple-300 hover:scale-105 hover:bg-[#6b2fd5] transition-all duration-300 border-none animate-float-b group cursor-pointer"
        aria-label="Contact Admin Support"
      >
        <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute right-16 bg-[#0f0e0d] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md whitespace-nowrap">
          Support Desk
        </span>
      </button>

      {/* 2. PREMIUM FROSTED GLASS SUPPORT COMPONENT DRAWER / MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[49] flex items-center justify-center p-6 bg-black/10 backdrop-blur-sm animate-fadeIn">
          {/* Overlay click to close */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Box */}
          <div className="w-full max-w-md glass-panel-heavy rounded-[32px] p-8 shadow-2xl relative z-10 text-left animate-scaleUp border border-white">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {success ? (
              /* Success Panel */
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 items-center justify-center text-4xl shadow-md animate-bounce mx-auto">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-syne text-2xl font-extrabold text-gray-900">Message Sent!</h3>
                <p className="text-sm font-light text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Your inquiry has been successfully dispatched to the Aurex support desk. We will reach out to you shortly.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full px-8 py-5 bg-[#7c3aed] hover:bg-[#6b2fd5] text-white font-semibold border-none transition-all duration-300"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              /* Form Panel */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-none font-bold uppercase tracking-wider rounded-full px-3 py-0.5 mb-2">
                    Support Desk
                  </Badge>
                  <h3 className="font-syne text-2xl font-extrabold text-gray-900 tracking-tight">
                    Contact Aurex Support
                  </h3>
                  <p className="text-xs font-light text-gray-400 mt-1">
                    Send a direct telemetry ticket to our administrators.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
                    ⚠️ {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Martins Onyia"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all duration-300 text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all duration-300 text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Message Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all duration-300 text-gray-800 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full py-6 bg-[#7c3aed] hover:bg-[#6b2fd5] text-white font-semibold shadow-lg shadow-purple-200 border-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Ticket...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Support Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
