import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: '2rem 0', marginTop: 'auto' }}>
            <div className="container flex flex-col items-center">
                <p style={{ color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>&copy; {new Date().getFullYear()} OnlyPGs. Real Listings Only.</p>
                <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '1rem' }}>Made with passion in India</p>
                <div className="flex gap-4">
                    <Link href="/about" style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>About Us</Link>
                    <Link href="/privacy-policy" style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>Privacy Policy</Link>
                    <Link href="/admin/login" style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>Admin Login</Link>
                </div>
            </div>
        </footer>
    );
}
