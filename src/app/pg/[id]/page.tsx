/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import dbConnect from '@/lib/db';
import PG from '@/models/PG';
import Room from '@/models/Room';
import { notFound } from 'next/navigation';

async function getPG(id: string) {
    try {
        await dbConnect();
        const pg = await PG.findById(id).lean();
        if (!pg) return null;

        const rooms = await Room.find({ pgId: pg._id }).lean();
        return JSON.parse(JSON.stringify({ ...pg, rooms }));
    } catch (e) {
        return null;
    }
}

export default async function PGDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const pg = await getPG(id);

    if (!pg) {
        notFound();
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <Link href="/search" className="btn-secondary inline-block" style={{ border: 'none', paddingLeft: 0, color: 'var(--primary-text)', fontWeight: 600 }}>← Back to Search</Link>
            </div>

            {/* Photos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 240px)', gap: '1rem', marginBottom: '2rem' }}>
                {pg.photos && pg.photos.length > 0 ? pg.photos.map((photo: string, index: number) => (
                    <div key={index} style={{ position: 'relative', width: '240px', height: '180px', background: '#eee', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                        <img src={photo} alt={`${pg.pgName} photo ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                )) : (
                    <div style={{ padding: '2rem', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#888' }}>
                        No Photos Available
                    </div>
                )}
            </div>

            <div className="pg-details-layout mb-8">
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{pg.pgName}</h1>
                    <div className="flex flex-col gap-2">
                        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary-text)' }}><strong>City:</strong> {pg.city}</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary-text)' }}><strong>Location:</strong> {pg.area}</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary-text)' }}><strong>Landmark:</strong> {pg.landmark || 'N/A'}</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary-text)' }}><strong>Security Deposit:</strong> ₹{pg.securityDeposit || 0}</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary-text)' }}><strong>Gender:</strong> <span style={{ textTransform: 'capitalize' }}>{pg.genderType}</span></p>
                    </div>
                </div>

                <aside className="pg-sidebar">
                    <div className="card sticky" style={{ position: 'sticky', top: '2rem' }}>
                        <h3 style={{ marginTop: 0 }}>Contact Details</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--secondary-text)' }}>Interested in this PG? Contact directly.</p>

                        <a href={`tel:${pg.contact.phone}`} className="btn w-full mb-4" style={{ width: '100%', display: 'flex', marginBottom: '1rem' }}>
                            Call {pg.contact.phone}
                        </a>
                        <a href={`https://wa.me/${pg.contact.whatsapp}`} target="_blank" className="btn btn-secondary w-full" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            Whatsapp {pg.contact.whatsapp}
                        </a>
                    </div>
                </aside>
            </div>

            <section className="mb-8">
                <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Room Options & Prices</h2>
                <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {pg.rooms.map((room: any) => (
                        <div key={room._id} className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ textTransform: 'capitalize', fontSize: '1rem', marginBottom: '0.5rem' }}>{room.roomType.replace('_', ' ')}</h3>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>₹{room.price}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--secondary-text)' }}>/mo</span></p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <section>
                    <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Facilities</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Object.entries(pg.facilities).map(([key, value]) => {
                            if (!value) return null;
                            return (
                                <span key={key} style={{
                                    border: '1px solid var(--accent)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '50px',
                                    textTransform: 'capitalize',
                                    background: 'transparent',
                                    color: 'var(--primary-text)',
                                    fontSize: '0.9rem'
                                }}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            );
                        })}
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Rules</h2>
                    <div className="flex flex-col gap-2">
                        <p style={{ margin: 0 }}><strong>Night Entry:</strong> {pg.rules.nightEntryTime || 'No restriction'}</p>
                        <p style={{ margin: 0 }}><strong>Visitors:</strong> {pg.rules.visitorPolicy === 'allowed' ? 'Allowed' : 'Not Allowed'}</p>
                        <p style={{ margin: 0 }}><strong>Smoking/Drinking:</strong> {pg.rules.smokingDrinking === 'allowed' ? 'Allowed' : 'Not Allowed'}</p>
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Other Details</h2>
                    <div className="flex flex-col gap-2">
                        <p style={{ margin: 0 }}><strong>Listing given by:</strong> <span style={{ textTransform: 'capitalize' }}>{pg.submittedBy || 'Owner'}</span></p>
                        <p style={{ margin: 0 }}><strong>Last updated:</strong> {new Date(pg.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
