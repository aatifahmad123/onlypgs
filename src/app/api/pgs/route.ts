/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PG from '@/models/PG';
import Room from '@/models/Room';

export async function GET(req: NextRequest) {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const city = searchParams.get('city');
    const pgName = searchParams.get('pgName');
    const gender = searchParams.get('gender');
    const roomType = searchParams.get('roomType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const food = searchParams.get('food');

    try {
        const query: any = { status: 'approved' };

        // City is effectively mandatory per PRD, but we allow flexible search backend-side
        if (city) {
            query.city = { $regex: new RegExp(city, 'i') };
        }

        if (pgName) {
            query.$text = { $search: pgName };
        }

        if (gender && gender !== 'all') {
            query.genderType = gender;
        }

        if (food === 'true') {
            query['facilities.food'] = true;
        }

        // Room filters
        let pgIdsFromRooms: any[] | null = null;
        if (roomType || minPrice || maxPrice) {
            const roomQuery: any = {};
            if (roomType && roomType !== 'all') roomQuery.roomType = roomType;

            if (minPrice || maxPrice) {
                roomQuery.price = {};
                if (minPrice) roomQuery.price.$gte = Number(minPrice);
                if (maxPrice) roomQuery.price.$lte = Number(maxPrice);
            }

            if (Object.keys(roomQuery).length > 0) {
                const rooms = await Room.find(roomQuery).select('pgId').lean();
                pgIdsFromRooms = rooms.map(r => r.pgId);

                // If rooms filtered but none found, we should return empty
                if (pgIdsFromRooms.length === 0) {
                    return NextResponse.json({ success: true, data: [] });
                }
            }
        }

        if (pgIdsFromRooms !== null) {
            query._id = { $in: pgIdsFromRooms };
        }

        const pgs = await PG.find(query).sort({ createdAt: -1 }).lean();

        // Attach room details for display (min price, types available)
        const pgsWithDetails = await Promise.all(pgs.map(async (pg) => {
            const rooms = await Room.find({ pgId: pg._id }).lean();
            const minPrice = rooms.reduce((min, r) => (r.price < min ? r.price : min), Infinity);
            return {
                ...pg,
                rooms,
                minPrice: minPrice === Infinity ? null : minPrice
            };
        }));

        return NextResponse.json({ success: true, data: pgsWithDetails });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();

        // Create PG
        const pg = await PG.create(body);

        // Create Rooms
        if (body.rooms && Array.isArray(body.rooms) && body.rooms.length > 0) {
            const roomDocs = body.rooms.map((r: any) => ({
                pgId: pg._id,
                roomType: r.roomType,
                price: Number(r.price)
            }));
            await Room.insertMany(roomDocs);
        }

        return NextResponse.json({ success: true, data: pg }, { status: 201 });
    } catch (error) {
        console.error('Submission Error:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
