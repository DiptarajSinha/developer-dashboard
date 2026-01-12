import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { GlobalSearch } from '@/components/GlobalSearch';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DEV.NET | Developer Dashboard', 
  description: 'A Mission Control Dashboard for my GitHub projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased overflow-x-hidden w-full`}>
        <Providers>
          <GlobalSearch /> 
          {/* Flex wrapper prevents sidebar and content overlap on initial load */}
          <div className="flex min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}