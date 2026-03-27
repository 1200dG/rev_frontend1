import { envVars } from "config";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const secret = envVars.nextAuthSecret;

const roleAccessMap: Record<string, string[]> = {
  "/about": ["ADMIN", "USER", "MODERATOR"],
  "/admin": ["ADMIN"],             
  "/clash": ["ADMIN", "USER"],
  "/enigma": ["ADMIN", "USER"],
  "/faq": ["ADMIN", "USER", "MODERATOR"],
  "/gamehub": ["ADMIN", "USER"],
  "/leaderboard": ["ADMIN", "USER"],
  "/payments": ["ADMIN", "USER"],
  "/profile": ["ADMIN", "USER"],
  "/riddles": ["ADMIN", "USER"],
  "/settings": ["ADMIN", "USER"],
  "/statistics": ["ADMIN", "USER"],
};

const authPages = ["/auth/sign-in", "/auth/sign-up"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({ req, secret });

  if (authPages.some((page) => pathname.startsWith(page)) && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  for (const [prefix, allowedRoles] of Object.entries(roleAccessMap)) {
    if (pathname.startsWith(prefix)) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
      }
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(
          new URL(`/auth/unauthorized?route=${encodeURIComponent(pathname)}`, req.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/auth/:path*", 
    "/admin/:path*", 
    "/clash/:path*", 
    "/enigma/:path*", 
    "/gamehub/:path*", 
    "/leaderboard/:path*", 
    "/payments/:path*",
    "/profile/:path*", 
    "/riddles/:path*", 
    "/settings/:path*",
    "/statistics/:path*",
  ],
};
