import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }
    await dbConnect();
    try {
        const count = await Admin.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: 'Admin already exists' });
        }

        const passwordHash = await bcrypt.hash('admin123', 10);
        await Admin.create({
            name: 'Admin',
            email: 'admin@onlypgs.com',
            passwordHash
        });

        return NextResponse.json({ message: 'Admin created: admin@onlypgs.com / admin123' });
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
