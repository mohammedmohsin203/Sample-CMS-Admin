import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const origin = req.headers.get("origin")

    // ✅ Allowed origins (pull from env for safety)
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map(o => o.trim())

    const res = NextResponse.next()

    if (origin && allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Origin", origin)
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    }

    // ✅ Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return new NextResponse(null, { headers: res.headers })
    }

    return res
}

// Apply only to API routes
export const config = {
    matcher: "/api/:path*",
}
