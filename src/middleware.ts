import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow everyone to access /chat/session (for login/session creation)
    if (pathname.startsWith('/chat/session')) {
        return NextResponse.next();
    }

    // Protect /chat (and subroutes if needed)
    if (pathname === '/chat') {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            // Redirect unauthenticated users to /chat/session for login/session creation
            const sessionUrl = new URL('/chat/session', req.url);
            return NextResponse.redirect(sessionUrl);
        }
        try {
            await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
        } catch (e) {
            const sessionUrl = new URL('/chat/session', req.url);
            return NextResponse.redirect(sessionUrl);
        }
    }

    // For all other routes, do nothing special
    return NextResponse.next();
}

// This will make sure our middleware only runs on /app/* route. (everything under /app including /app)
export const config = {
    matcher: ['/:path*', "/auth"],
}
