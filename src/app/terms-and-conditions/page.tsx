export default function TermsAndConditionsPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Terms &amp; Conditions</h1>
            <div className="card" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--secondary-text)' }}>Last updated: October 23, 2026</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    By using OnlyPGs, you agree to these terms. OnlyPGs is a discovery platform that helps people find PG accommodations and connect directly with owners or managers.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>1. Listings and Accuracy</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    Listing providers are responsible for the accuracy, legality, and timeliness of the information they submit. We may review, edit, reject, suspend, or remove listings that are incomplete, misleading, duplicated, outdated, or otherwise unsuitable.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>2. Direct Contact and Agreements</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    OnlyPGs does not negotiate, book, lease, manage, or guarantee any accommodation. Any call, WhatsApp conversation, visit, payment, tenancy, or other agreement is between the user and the listing provider. Users should independently verify the property, pricing, availability, identity, and terms before making a decision or payment.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>3. Acceptable Use</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    You must not submit false information, impersonate another person, misuse contact details, scrape the platform, upload content you do not have rights to use, or use OnlyPGs for unlawful, abusive, fraudulent, or harmful activity.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>4. Photos and Content</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    By submitting photos or other content, you confirm that you have permission to share it and allow OnlyPGs to display it for operating and promoting the listing. You remain responsible for your content.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>5. Availability and Liability</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    We work to keep listings useful and available, but we do not promise that every listing is current, error-free, or suitable for a particular user. To the extent permitted by law, OnlyPGs is not responsible for disputes, losses, payments, property conditions, or conduct arising from dealings between users and listing providers.
                </p>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>6. Changes and Contact</h2>
                <p style={{ marginBottom: 0, lineHeight: '1.6' }}>
                    We may update these terms as OnlyPGs evolves. Questions or concerns can be sent to{' '}
                    <a href="mailto:jammyjellyfish26@proton.me" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        jammyjellyfish26@proton.me
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
