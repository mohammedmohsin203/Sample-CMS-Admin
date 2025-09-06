// middleware.ts
import { NextResponse } from "next/server";

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://sample-cms-site.vercel.app",
    "https://sample-cms-admin-czl7.vercel.app",
];

export function middleware(req: Request) {
    const origin = req.headers.get("origin") ?? "";
    const res = NextResponse.next();

    if (allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.headers.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return new NextResponse(null, { status: 200, headers: res.headers });
    }

    return res;
}

export const config = {
    matcher: "/api/:path*",
};
