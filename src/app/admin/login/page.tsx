'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                router.push('/admin/dashboard');
                // Keep loading true
            } else {
                alert('Login failed: ' + data.error);
                setLoading(false);
            }
        } catch (e) {
            alert('Login error');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="flex flex-col items-center justify-center gap-1">
                    <img src="/pg-icon.png" alt="Loading..." style={{ width: '32px', height: '32px', objectFit: 'contain' }} className="animate-pulse" />
                    <p style={{ fontSize: '1.2rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Logging in...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleLogin} className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>Admin Login</h1>
                <div className="mb-4">
                    <label className="label">Email</label>
                    <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="label">Password</label>
                    <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button className="btn w-full" style={{ width: '100%' }} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            </form>
        </div>
    );
}
