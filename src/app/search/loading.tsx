export default function Loading() {
    return (
        <div className="container flex items-center justify-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="flex flex-col items-center justify-center gap-1">
                <img src="/pg-icon.png" alt="Loading..." style={{ width: '32px', height: '32px', objectFit: 'contain' }} className="animate-pulse" />
                <p style={{ fontSize: '1.2rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Searching PGs for you...</p>
            </div>
        </div>
    );
}
