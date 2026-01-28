import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PG from '@/models/PG';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const token = req.cookies.get('admin_token');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { status } = await req.json(); // approved, rejected

        const pg = await PG.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ success: true, data: pg });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
