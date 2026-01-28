'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <button onClick={handleLogout} className="btn" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Logout
        </button>
    );
}
