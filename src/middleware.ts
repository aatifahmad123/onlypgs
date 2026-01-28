import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (request.nextUrl.pathname === '/admin/login') return NextResponse.next();

        const token = request.cookies.get('admin_token')?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'secret'));
            return NextResponse.next();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
