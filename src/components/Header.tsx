'use client';

import Link from 'next/link';
import { Outfit } from 'next/font/google';
import { usePathname } from 'next/navigation';

const logoFont = Outfit({ subsets: ['latin'], weight: ['700'] });

export default function Header() {
    const pathname = usePathname();
    const isAddPgPage = pathname === '/add-pg';
    const showFindPG = isAddPgPage || pathname === '/about' || pathname === '/privacy-policy';

    return (
        <header style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div className="container flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link href="/" className={logoFont.className} style={{ fontSize: '1.75rem', color: 'var(--primary-text)', textDecoration: 'none' }}>OnlyPGs</Link>
                    <span className="header-tagline">Verified PGs. Zero Hassle.</span>
                </div>
                <nav className="flex gap-4">
                    {showFindPG ? (
                        <Link href="/" className="btn">Find a PG</Link>
                    ) : (
                        <Link href="/add-pg" className="btn">List Your PG</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
