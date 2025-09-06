import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// GET single inspection
export async function GET(req: Request, { params }: Params) {
    const inspection = await prisma.inspection.findUnique({
        where: { id: Number(params.id) },
        include: { university: true, employee: true },
    });

    if (!inspection) {
        return NextResponse.json({ error: "Inspection not found" }, { status: 404 });
    }

    return NextResponse.json(inspection);
}

// UPDATE inspection
export async function PUT(req: Request, { params }: Params) {
    const body = await req.json();

    const inspection = await prisma.inspection.update({
        where: { id: Number(params.id) },
        data: {
            universityId: body.universityId,
            employeeId: body.employeeId,
            inspectedAt: body.inspectedAt ? new Date(body.inspectedAt) : undefined,
        },
        include: { university: true, employee: true },
    });

    return NextResponse.json(inspection);
}

// DELETE inspection
export async function DELETE(req: Request, { params }: Params) {
    await prisma.inspection.delete({
        where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Inspection deleted" });
}
