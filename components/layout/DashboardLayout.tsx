'use client';

import { ReactNode, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  User,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = session?.user?.role === 'admin';

  const investorNavItems = [
    { href: '/dashboard', label: 'Overview', icon: BarChart3 },
    { href: '/dashboard/deposits', label: 'Deposits', icon: TrendingUp },
    { href: '/dashboard/withdrawals', label: 'Withdrawals', icon: TrendingDown },
    { href: '/dashboard/packages', label: 'Yield Pools', icon: Package },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { href: '/admin/dashboard', label: 'Admin Panel', icon: BarChart3 },
    { href: '/admin/users', label: 'Users Manager', icon: Users },
    { href: '/admin/deposits', label: 'Deposits Approval', icon: TrendingUp },
    { href: '/admin/withdrawals', label: 'Withdrawals Processing', icon: TrendingDown },
    { href: '/admin/packages', label: 'Yield Config', icon: Package },
  ];

  const navItems = isAdmin ? adminNavItems : investorNavItems;

  return (
    <div className="flex h-screen bg-[#f8f7f5] text-[#0f0e0d] relative overflow-hidden">
      
      {/* Mobile Hamburger */}
      <button
        className="md:hidden absolute top-4 right-4 z-50 p-2 rounded-xl bg-white border border-purple-100 text-[#7c3aed] shadow-md focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open sidebar"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white/80 border-r border-purple-100/60 backdrop-blur-lg transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#4169e1] via-[#7c3aed] to-[#e040fb] flex items-center justify-center shadow-md shrink-0">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="font-syne text-xl font-bold tracking-tight bg-gradient-to-r from-[#4169e1] to-[#e040fb] bg-clip-text text-transparent">
              Aurex Capital
            </span>
          </Link>
        </div>

        <nav className="mt-8 px-4 space-y-1.5 flex-1 h-[calc(100%-120px)] flex flex-col justify-between">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/admin/dashboard' && pathname === '/admin');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-[#4169e1]/10 to-[#7c3aed]/10 text-[#7c3aed] shadow-sm font-semibold border-l-4 border-[#7c3aed]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="pb-8">
            <button
              className="flex items-center px-4 py-3 w-full text-sm font-semibold text-red-500 bg-red-50/50 border border-red-100 rounded-2xl transition-all hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-5 w-5 mr-3 shrink-0" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}