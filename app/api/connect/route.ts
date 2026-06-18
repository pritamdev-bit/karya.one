import { generateOAuthUrl } from 'corsair/oauth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/src/server/corsair';
import { auth } from '@clerk/nextjs/server';

const REDIRECT_URI = `${process.env.APP_URL}/api/auth`;

export async function GET(request: NextRequest) {
    // const tenantId = await getSessionTenantId(request);
    const { isAuthenticated, userId: tenantId } = await auth();
    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // console.log(tenantId, 'tenantId');
    if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plugin = new URL(request.url).searchParams.get('plugin');
    if (!plugin) {
        return NextResponse.json({ error: 'Missing plugin param' }, { status: 400 });
    }

    const { url, state } = await generateOAuthUrl(corsair, plugin, {
        tenantId,
        redirectUri: REDIRECT_URI,
    });

    const response = NextResponse.redirect(url);
    response.cookies.set('oauth_state', state, {
        httpOnly: true,   // not readable by JavaScript
        sameSite: 'lax',  // safe for provider redirects
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        maxAge: 60 * 10,  // expires in 10 minutes
    });
    return response;
}