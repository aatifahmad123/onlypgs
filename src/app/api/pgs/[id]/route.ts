import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PG from '@/models/PG';
import Room from '@/models/Room';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await params;
        const pg = await PG.findById(id).lean();
        if (!pg) {
            return NextResponse.json({ success: false, error: 'PG not found' }, { status: 404 });
        }

        const rooms = await Room.find({ pgId: pg._id }).lean();

        return NextResponse.json({ success: true, data: { ...pg, rooms } });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
