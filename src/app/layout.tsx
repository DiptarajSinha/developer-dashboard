import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// UPDATE THIS SECTION
export const metadata: Metadata = {
  title: 'DEV.NET | Developer Dashboard', 
  description: 'A Mission Control Dashboard for my GitHub projects.',
  icons: {
    icon: '/favicon.ico', // You can replace favicon.ico in your public folder later
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}