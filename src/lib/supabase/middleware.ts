import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

/**
 * App routes that REQUIRE an authenticated user. Everything else is public:
 * the marketing site (`/`, `/pricing`, `/features`, …), `/login`, `/signup`,
 * and `/api/*` route handlers (which enforce their own auth, e.g. cron).
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/content-studio",
  "/ideas",
  "/posts",
  "/trends",
  "/media",
  "/calendar",
  "/analytics",
  "/inbox",
  "/competitors",
  "/automations",
  "/integrations",
  "/billing",
  "/settings",
  "/studio",
  "/admin",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Refreshes the Supabase auth session on every request and enforces route
 * protection. No-op in demo/preview mode (no real Supabase env).
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  // Demo/preview mode: skip auth entirely.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: getUser() refreshes the session token + cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Unauthenticated trying to reach a protected app route → send to login.
  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated visiting login/signup → send to dashboard.
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
