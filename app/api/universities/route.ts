import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const universities = await prisma.university.findMany();
    return NextResponse.json(universities);
}

export async function POST(req: Request) {
    const body = await req.json();

    if (!body.latitude || !body.longitude) {
        return NextResponse.json(
            { error: "Latitude/Longitude required" },
            { status: 400 }
        );
    }

    const university = await prisma.university.create({
        data: {
            name: body.name,
            country: body.country,
            region: body.region,
            latitude: body.latitude,
            longitude: body.longitude,
            category: body.category,
        },
    });

    return NextResponse.json(university);
}
