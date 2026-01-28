export default function AboutPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>About Us</h1>
            <div className="card" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    Welcome to <strong>OnlyPGs</strong>, India's most trusted platform for finding Paying Guest accommodations without the clutter.
                </p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    Our mission is simple: <strong>Real Listings Only. Seamless contact with PG owner/manager.</strong>
                </p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    We verify every listing to ensure you get exactly what you see. Whether you are a student or a working professional, we help you find a home away from home that fits your budget and lifestyle.
                </p>

            </div>
        </div>
    );
}
