import './globals.css';
import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { Providers } from './providers';
import CustomCursor from '@/components/ui/CustomCursor';
import SupportButton from '@/components/ui/SupportButton';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm',
});

export const metadata: Metadata = {
  title: 'Aurex Capital - AI Auto-Trading Program',
  description: 'Earn passive income with our AI-powered crypto trading platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <Providers>
          <CustomCursor />
          <SupportButton />
          <div className="bg-ambient">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
            <div className="blob blob-4" />
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}



