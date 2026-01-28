export default function PrivacyPolicyPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Privacy Policy</h1>
            <div className="card" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', color: '#666' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    We collect basic contact information (Phone Number, Name) when you list a PG. We do not share this information with third parties without your consent.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Information</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    The information provided is used solely for the purpose of listing and verifying PG accommodations on our platform.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    We implement standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>4. Contact Us</h2>
                <p style={{ lineHeight: '1.6' }}>
                    If you have any questions about this Privacy Policy, please contact us.
                </p>
            </div>
        </div>
    );
}
