import { Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'OnlyPGs - Real PG Listings',
  description: 'Find your next PG directly from owners. No spam, no ads.',
  icons: {
    icon: '/pg-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'var(--font-space-grotesk)' }}>
        <Header />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
