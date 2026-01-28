import Link from 'next/link';
import dbConnect from '@/lib/db';
import PG from '@/models/PG';
import Room from '@/models/Room';
import { notFound } from 'next/navigation';
import AdminActions from '@/components/AdminActions';

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

export default async function AdminReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const pg = await getPG(id);

    if (!pg) {
        notFound();
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
            <div className="mb-4">
                <Link href="/admin/dashboard" className="btn-secondary" style={{ border: 'none', paddingLeft: 0, color: 'var(--primary-text)', fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>← Back to Dashboard</Link>
                <div className="flex justify-between items-center py-2 border-b">
                    <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Review PG</h1>
                    <AdminActions pgId={pg._id} currentStatus={pg.status} />
                </div>
            </div>

            <div className="mb-4 inline-flex items-center gap-2">
                <strong style={{ color: 'var(--primary-text)' }}>Current Status:&nbsp;</strong>
                <span style={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    color: pg.status === 'approved' ? '#2E7D32' : pg.status === 'rejected' ? '#C62828' : '#EF6C00'
                }}>{pg.status}</span>
            </div>

            {/* Photos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 240px)', gap: '1rem', marginBottom: '2rem' }}>
                {pg.photos && pg.photos.length > 0 ? pg.photos.map((photo: string, index: number) => (
                    <div key={index} style={{ position: 'relative', width: '240px', height: '180px', background: '#eee', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                        <img src={photo} alt={`${pg.pgName} photo ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {index === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.8rem', padding: '4px', textAlign: 'center', fontWeight: '500' }}>Cover</span>}
                    </div>
                )) : (
                    <div style={{ padding: '2rem', background: '#ddd', borderRadius: '8px' }}>No Photos</div>
                )}
            </div>

            <div className="flex gap-8 details-layout">
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{pg.pgName}</h1>
                    <div className="flex flex-col gap-1 mb-6">
                        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary-text)' }}><strong>City:</strong> {pg.city}</p>
                        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary-text)' }}><strong>Location:</strong> {pg.area}</p>
                        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary-text)' }}><strong>Landmark:</strong> {pg.landmark || 'N/A'}</p>
                        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary-text)' }}><strong>Security Deposit:</strong> ₹{pg.securityDeposit || 0}</p>
                        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary-text)' }}><strong>Gender Allowed:</strong> <span style={{ textTransform: 'capitalize' }}>{pg.genderType}</span></p>
                    </div>

                    <section className="mb-8">
                        <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Rooms</h2>
                        <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {pg.rooms.map((room: any) => (
                                <div key={room._id} className="card p-3 flex justify-between items-center" style={{ width: '100%' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{room.roomType.replace(/_/g, ' ')}</span>
                                    <strong style={{ fontSize: '1.1rem' }}>₹{room.price}</strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="info-grid">
                        <section className="mb-8">
                            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Facilities</h2>
                            <div className="flex flex-col gap-1">
                                {Object.entries(pg.facilities).map(([key, value]) => (
                                    <div key={key} style={{ textTransform: 'capitalize', fontSize: '1rem', lineHeight: '1.5' }}><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value ? 'Yes' : 'No'}</div>
                                ))}
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Rules</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem', margin: 0 }}>
                                <li style={{ fontSize: '1rem', lineHeight: '1.5' }}><strong>Night Entry:</strong> {pg.rules.nightEntryTime || 'No Restriction'}</li>
                                <li style={{ fontSize: '1rem', lineHeight: '1.5' }}><strong>Visitors:</strong> <span style={{ textTransform: 'capitalize' }}>{pg.rules.visitorPolicy.replace('_', ' ')}</span></li>
                                <li style={{ fontSize: '1rem', lineHeight: '1.5' }}><strong>Smoking/Drinking:</strong> <span style={{ textTransform: 'capitalize' }}>{pg.rules.smokingDrinking.replace('_', ' ')}</span></li>
                            </ul>
                        </section>

                        <section className="mb-4">
                            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Contact Info</h2>
                            <div className="flex flex-col gap-1">
                                <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5' }}><strong>Phone:</strong> {pg.contact.phone}</p>
                                <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5' }}><strong>WhatsApp:</strong> {pg.contact.whatsapp || 'N/A'}</p>
                                <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5' }}><strong>Submitted By:</strong> <span style={{ textTransform: 'capitalize' }}>{pg.submittedBy || 'Owner'}</span></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
