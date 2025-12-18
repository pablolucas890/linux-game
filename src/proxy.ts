import { NextRequest, NextResponse } from 'next/server';

interface PublicRoute {
  path: string;
  proxy?: string;
}

const publicRoutes: PublicRoute[] = [
  { path: '/welcome' },
  { path: '/register', proxy: '/dashboard' },
  { path: '/one', proxy: '/dashboard' },
];

const REDIRECT_WHEN_NOT_LOGGED_IN = '/welcome';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get('authToken');

  if (!authToken && publicRoute) {
    console.log('User is not logged and is trying to access a public route, continuing...');
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    console.log('User is not logged and is trying to access a protected route, redirecting to welcome page...');
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_LOGGED_IN;
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute.proxy) {
    console.log('User is logged and is trying to access a public route with a proxy redirecting to proxy...');
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.rewrite(redirectUrl);
  }

  if (authToken && !publicRoute) {
    console.log('User is logged and is trying to access a protected route, continuing...');
    // TODO: Check if JWT token is valid
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.mp4$).*)'],
};
