import Link from 'next/link';

export default function SubmissionSuccessPage() {
    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h1>Submission Successful!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--secondary-text)', marginTop: '1rem', marginBottom: '2rem' }}>
                    Your PG has been submitted and is under verification.
                </p>
                <Link href="/" className="btn">Back to Home</Link>
            </div>
        </div>
    );
}
