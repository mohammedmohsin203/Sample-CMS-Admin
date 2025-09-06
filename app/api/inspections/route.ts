import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all inspections
export async function GET() {
    try {
        const inspections = await prisma.inspection.findMany({
            include: {
                university: true,
                employee: true,
            },
        });
        return NextResponse.json(inspections, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new inspection
export async function POST(req: Request) {
    const body = await req.json();
    const inspection = await prisma.inspection.create({
        data: {
            universityId: Number(body.universityId),
            employeeId: Number(body.employeeId),
            inspectedAt: body.inspectedAt ? new Date(body.inspectedAt) : undefined,
        },
        include: { university: true, employee: true },
    });
    return NextResponse.json(inspection);
}
