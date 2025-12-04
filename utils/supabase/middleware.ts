import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Public routes - kein Auth check
  const publicRoutes = [
    '/auth',
    '/login',
    '/register',
    '/',
    '/products',
    '/tailors',
    '/about',
    '/how-it-works',
    '/api', // API routes werden separat geschützt
    '/_next',
    '/favicon.ico',
  ];
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route)) || path === '/';

  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Auth required für alle anderen Routes
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Note: Role-based route protection is now handled at the page level
  // using server components, because Edge Runtime doesn't support Prisma.
  // Each protected page should verify the user's role by calling the database.

  return supabaseResponse;
}
