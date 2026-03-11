import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');

    // 1. Jika mencoba akses area terproteksi tapi tidak ada token
    if (pathname.startsWith('/admin') || 
        pathname.startsWith('/dashboard') || 
        pathname.startsWith('/whatsapp') || 
        pathname.startsWith('/blast') || 
        pathname.startsWith('/withdrawal') || 
        pathname.startsWith('/profile')) {
        
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // 2. Verifikasi Token
            const { payload } = await jwtVerify(token, secret);
            const userRole = payload.role;

            // 3. Proteksi Khusus Admin: Jika role bukan admin, tendang ke dashboard member
            if (pathname.startsWith('/admin') && userRole !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // 4. Proteksi Khusus Member: Jika admin coba masuk ke dashboard member
            if (!pathname.startsWith('/admin') && userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }

            return NextResponse.next();
        } catch (error) {
            // Jika token rusak/expired
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

// Konfigurasi Matcher untuk URL yang diawasi
export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
        '/whatsapp/:path*',
        '/blast/:path*',
        '/withdrawal/:path*',
        '/profile/:path*',
    ],
};
