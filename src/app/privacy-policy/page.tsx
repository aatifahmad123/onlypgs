export default function PrivacyPolicyPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Privacy Policy</h1>
            <div className="card" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--secondary-text)' }}>Last updated: October 23, 2026</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    This Privacy Policy explains how OnlyPGs handles information when you browse PG listings, contact an owner, or submit a listing.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    When you submit a PG, we may collect the property details you provide, including the PG name, location, facilities, pricing, photos, owner or manager name, and contact details. Search preferences and basic technical information may also be processed to operate and improve the website.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Information</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    We use submitted information to review and publish listings, help users compare PGs, enable direct contact with owners, respond to queries, prevent misuse, and maintain the reliability and security of OnlyPGs.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>3. Public Listings and Direct Contact</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    Information included in an approved listing, such as property details, photos, location, and contact options, may be visible to visitors. If you choose to contact an owner by phone or WhatsApp, that interaction takes place directly with the owner and is subject to their own privacy practices.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>4. Sharing and Service Providers</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    We do not sell personal information. We may share information with service providers that help us host the website, store listing photos, or operate the platform, only as needed to provide those services. We may also disclose information when required by law or to protect the platform and its users.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>5. Retention and Security</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    We retain listing and contact information for as long as it is needed to operate the listing or resolve legitimate issues. We use reasonable safeguards, but no online service can guarantee absolute security.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>6. Your Choices</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    You may ask us to correct or remove information you submitted, or raise a privacy concern. Requests can be sent to{' '}
                    <a href="mailto:jammyjellyfish26@proton.me" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        jammyjellyfish26@proton.me
                    </a>
                    .
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>7. Contact Us</h2>
                <p style={{ marginBottom: 0, lineHeight: '1.6' }}>
                    If you have questions about this policy or how OnlyPGs handles information, contact us at the email address above.
                </p>
            </div>
        </div>
    );
}
