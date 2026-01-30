/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Filters from './Filters';
import dbConnect from '@/lib/db';
import PG from '@/models/PG';
import Room from '@/models/Room';

// Helper to fetch data (Server Component)
async function getPGs(searchParams: any) {
    await dbConnect();

    const { city, pgName, gender = 'boys', roomType, minPrice, maxPrice, food, wifi, washingMachine, search } = searchParams;

    const query: any = { status: 'approved' };

    if (city) query.city = { $regex: new RegExp(city as string, 'i') };
    if (pgName) query.$text = { $search: pgName as string };
    query.genderType = gender;

    // Global Search (Name, Location, Landmark)
    if (search) {
        const regex = new RegExp(search as string, 'i');
        query.$or = [
            { pgName: { $regex: regex } },
            { area: { $regex: regex } },
            { landmark: { $regex: regex } }
        ];
    }

    // Facilities Filters
    if (food === 'true') query['facilities.food'] = true;
    if (wifi === 'true') query['facilities.wifi'] = true;
    if (washingMachine === 'true') query['facilities.washingMachine'] = true;

    let pgIdsFromRooms: any[] | null = null;
    // Room filter logic
    if (roomType || minPrice || maxPrice) {
        const roomQuery: any = {};
        if (roomType && roomType !== 'all') roomQuery.roomType = roomType;
        if (minPrice || maxPrice) {
            roomQuery.price = {};
            if (minPrice) roomQuery.price.$gte = Number(minPrice);
            if (maxPrice) roomQuery.price.$lte = Number(maxPrice);
        }

        const rooms = await Room.find(roomQuery).select('pgId').lean();
        pgIdsFromRooms = rooms.map(r => r.pgId);
        if (pgIdsFromRooms.length === 0) return [];
    }

    if (pgIdsFromRooms) {
        query._id = { $in: pgIdsFromRooms };
    }

    const pgs = await PG.find(query).sort({ createdAt: -1 }).lean();

    const pgsWithRooms = await Promise.all(pgs.map(async (pg: any) => {
        const rooms = await Room.find({ pgId: pg._id }).lean();
        const minPrice = rooms.reduce((min: number, r: any) => (Number(r.price) < min ? Number(r.price) : min), Infinity);
        const maxPrice = rooms.reduce((max: number, r: any) => (Number(r.price) > max ? Number(r.price) : max), 0);
        return {
            ...pg,
            rooms,
            minPrice: minPrice === Infinity ? null : minPrice,
            maxPrice: maxPrice === 0 ? null : maxPrice
        };
    }));

    return JSON.parse(JSON.stringify(pgsWithRooms));
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const pgs = await getPGs(resolvedParams);

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div className="flex justify-between items-center mb-4 mt-6">
                <h1 style={{ fontSize: '1.5rem' }}>PGs in {resolvedParams.city || 'India'} <span style={{ color: 'var(--secondary-text)', fontSize: '1rem', fontWeight: 400 }}>({pgs.length} results)</span></h1>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <form className="search-bar-form">
                    <input type="hidden" name="city" value={resolvedParams.city as string || ''} />
                    <input
                        type="text"
                        name="search"
                        className="input search-bar-input"
                        placeholder="Search by PG Name, Location, or Landmark..."
                        defaultValue={resolvedParams.search as string}
                        style={{ padding: '0.6rem 1rem', fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    />
                    <div className="search-buttons">
                        <button type="submit" className="btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem', height: 'auto' }}>Search</button>
                        <Link
                            href={`/search?city=${resolvedParams.city || ''}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem', textDecoration: 'none', height: 'auto', display: 'flex', alignItems: 'center' }}
                        >
                            Clear
                        </Link>
                    </div>
                </form>
            </div>

            <div className="search-layout">
                {/* Sidebar Filters */}
                {/* Sidebar Filters */}
                <Filters initialFilters={resolvedParams} />

                {/* Results List */}
                <main className="flex flex-col gap-4" style={{ flex: 1 }}>
                    {pgs.length === 0 ? (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--secondary-text)' }}>
                            No PGs found matching your criteria. Try adjusting filters.
                        </div>
                    ) : pgs.map((pg: any) => (
                        <Link href={`/pg/${pg._id}`} key={pg._id} className="card result-card result-card-layout" style={{ textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.2s' }}>
                            <div className="result-image">
                                {pg.photos && pg.photos[0] ? (
                                    <img src={pg.photos[0]} alt={pg.pgName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>No Image</div>
                                )}
                            </div>
                            <div className="flex flex-col justify-between" style={{ flex: 1 }}>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-text)' }}>{pg.pgName}</h2>
                                        <span style={{
                                            color: 'var(--secondary-text)',
                                            border: '1px solid var(--border)',
                                            padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', textTransform: 'capitalize'
                                        }}>{pg.genderType}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-text)', fontSize: '0.95rem' }}>
                                            <span style={{ width: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src="/location.png" alt="Location" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                                            </span>
                                            <span>{pg.area}, {pg.city}</span>
                                        </div>
                                        {pg.landmark && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-text)', fontSize: '0.95rem' }}>
                                                <span style={{ width: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src="/landmark.png" alt="Landmark" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                                                </span>
                                                <span>{pg.landmark}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="facilities-container">
                                        {Object.entries(pg.facilities)
                                            .filter(([_, v]) => v)
                                            .slice(0, 3)
                                            .map(([key]) => (
                                                <span key={key} style={{
                                                    fontSize: '0.8rem',
                                                    border: '1px solid var(--accent)',
                                                    borderRadius: '50px',
                                                    padding: '2px 10px',
                                                    textTransform: 'capitalize',
                                                    color: 'var(--primary-text)'
                                                }}>
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div>
                                        {pg.minPrice !== null ? (
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
                                                ₹{pg.minPrice}
                                                {pg.maxPrice !== null && pg.maxPrice > pg.minPrice && ` - ₹${pg.maxPrice}`}
                                                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--secondary-text)' }}>/mo</span>
                                            </p>
                                        ) : (
                                            <p style={{ margin: 0, color: 'var(--secondary-text)' }}>Price Varies</p>
                                        )}
                                    </div>
                                    <span className="btn-secondary view-details-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '20px' }}>View Details</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </main>
            </div>
        </div>
    );
}
