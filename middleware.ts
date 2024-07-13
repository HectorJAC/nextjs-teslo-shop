import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const session:any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    //return NextResponse.redirect(new URL('/about-2', req.url));

    if (!session) {
        const requestPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.search = `/p=${requestPage}`;

        return NextResponse.redirect(url);
    };

    const validRoles = ['admin'];

    if (!validRoles.includes(session.user.role)) {
        const urlHome = req.nextUrl.clone();
        urlHome.pathname = '/';
        return NextResponse.redirect(urlHome);
    };

    return NextResponse.next();
};

export const config = {
    matcher: [
        '/checkout/address',
        '/checkout/summary',
        '/admin',
        '/admin/users',
    ]
};