'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const isAddPgPage = pathname === '/add-pg';
    const showFindPG = isAddPgPage || pathname === '/about' || pathname === '/privacy-policy';

    return (
        <header style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div className="container flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Image src="/pg-icon.png" alt="PG Icon" width={32} height={32} style={{ objectFit: 'contain' }} />
                    <div className="flex items-baseline gap-2">
                        <Link href="/" style={{ fontSize: '1.75rem', color: 'var(--primary-text)', textDecoration: 'none', fontWeight: 700, lineHeight: 1 }}>OnlyPGs</Link>
                        <span className="header-tagline" style={{ position: 'relative', top: '7px' }}>Verified PGs. Zero Hassle.</span>
                    </div>
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
