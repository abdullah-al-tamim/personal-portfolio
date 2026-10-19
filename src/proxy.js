import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { isApprovedIdentity } from "@/lib/study-hub/validation.mjs";
export async function proxy(request) {
  let response = NextResponse.next({ request });
  let user = null;
  if (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY) {
    const client = createServerClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PUBLISHABLE_KEY,
      {
        cookieOptions: {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/study-hub",
        },
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(values) {
            values.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            values.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    // Session refresh and early redirect. Every private read and mutation also verifies identity.
    const result = await client.auth.getUser();
    user = result.error ? null : result.data.user;
  }
  if (
    request.nextUrl.pathname !== "/study-hub/login" &&
    !isApprovedIdentity(user, process.env.STUDY_HUB_OWNER_ID)
  ) {
    const redirect = NextResponse.redirect(
      new URL("/study-hub/login", request.url),
    );
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    response = redirect;
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  );
  return response;
}
export const config = { matcher: ["/study-hub/:path*"] };
