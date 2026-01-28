import Link from 'next/link';
import dbConnect from '@/lib/db';
import PG from '@/models/PG';
import CityFilter from './CityFilter';

import AdminLogoutButton from '@/components/AdminLogoutButton';

// Server Component helpers
async function getStats() {
    await dbConnect();
    const total = await PG.countDocuments();
    const pending = await PG.countDocuments({ status: 'pending' });
    const approved = await PG.countDocuments({ status: 'approved' });
    const rejected = await PG.countDocuments({ status: 'rejected' });
    return { total, pending, approved, rejected };
}

async function getUniqueCities() {
    await dbConnect();
    const cities = await PG.distinct('city');
    return cities.sort();
}

async function getPGs(status: string, city: string, page: number = 1, limit: number = 30) {
    await dbConnect();
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (city && city !== 'all') query.city = city;

    const skip = (page - 1) * limit;
    const pgs = await PG.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const totalDocs = await PG.countDocuments(query);

    return { pgs, totalDocs, totalPages: Math.ceil(totalDocs / limit) };
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ status?: string; page?: string; city?: string }> }) {
    const { status, page, city } = await searchParams;
    const currentStatus = status || 'all';
    const currentCity = city || 'all';
    const currentPage = Number(page) || 1;
    const itemsPerPage = 30;

    const stats = await getStats();
    const cities = await getUniqueCities();
    const { pgs, totalPages } = await getPGs(currentStatus, currentCity, currentPage, itemsPerPage);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.5rem' }}>Admin Dashboard</h1>
                <AdminLogoutButton />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                <div className="card text-center">
                    <h3 style={{ margin: 0 }}>Total</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{stats.total}</p>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid orange' }}>
                    <h3 style={{ margin: 0, color: 'orange' }}>Pending</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{stats.pending}</p>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid green' }}>
                    <h3 style={{ margin: 0, color: 'green' }}>Approved</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{stats.approved}</p>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid red' }}>
                    <h3 style={{ margin: 0, color: 'red' }}>Rejected</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{stats.rejected}</p>
                </div>
            </div>

            {/* Filters */}
            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/dashboard?status=all&city=${currentCity}`} className={`btn ${currentStatus === 'all' ? '' : 'btn-secondary'}`}>All</Link>
                    <Link href={`/admin/dashboard?status=pending&city=${currentCity}`} className={`btn ${currentStatus === 'pending' ? '' : 'btn-secondary'}`}>Pending</Link>
                    <Link href={`/admin/dashboard?status=approved&city=${currentCity}`} className={`btn ${currentStatus === 'approved' ? '' : 'btn-secondary'}`}>Approved</Link>
                    <Link href={`/admin/dashboard?status=rejected&city=${currentCity}`} className={`btn ${currentStatus === 'rejected' ? '' : 'btn-secondary'}`}>Rejected</Link>
                </div>
                <div>
                    <CityFilter cities={cities} currentCity={currentCity} />
                </div>
            </div>

            {/* Listing Table */}
            <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--accent)' }}>
                            <th style={{ padding: '1rem' }}>PG Name</th>
                            <th style={{ padding: '1rem' }}>City</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pgs.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center' }}>No PGs found</td></tr>
                        ) : JSON.parse(JSON.stringify(pgs)).map((pg: any) => (
                            <tr key={pg._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{pg.pgName}</td>
                                <td style={{ padding: '1rem' }}>{pg.city}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600,
                                        background: pg.status === 'approved' ? '#E8F5E9' : pg.status === 'rejected' ? '#FFEBEE' : '#FFF3E0',
                                        color: pg.status === 'approved' ? '#2E7D32' : pg.status === 'rejected' ? '#C62828' : '#EF6C00'
                                    }}>{pg.status.toUpperCase()}</span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                    {new Date(pg.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <Link href={`/admin/pg/${pg._id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Review</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
                    <Link
                        href={`/admin/dashboard?status=${currentStatus}&city=${currentCity}&page=${currentPage - 1}`}
                        className={`btn btn-secondary ${currentPage <= 1 ? 'disabled' : ''}`}
                        style={{ pointerEvents: currentPage <= 1 ? 'none' : 'auto', opacity: currentPage <= 1 ? 0.5 : 1 }}
                    >
                        Previous
                    </Link>
                    <span style={{ fontWeight: 600 }}>Page {currentPage} of {totalPages}</span>
                    <Link
                        href={`/admin/dashboard?status=${currentStatus}&city=${currentCity}&page=${currentPage + 1}`}
                        className={`btn btn-secondary ${currentPage >= totalPages ? 'disabled' : ''}`}
                        style={{ pointerEvents: currentPage >= totalPages ? 'none' : 'auto', opacity: currentPage >= totalPages ? 0.5 : 1 }}
                    >
                        Next
                    </Link>
                </div>
            )}
        </div>
    );
}
