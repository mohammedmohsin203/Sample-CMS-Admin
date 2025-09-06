import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
    params: Promise<{ id: string }>;
};
// GET single university
export async function GET(req: Request, { params }: Params) {
    const { id } = await params;
    const university = await prisma.university.findUnique({
        where: { id: Number(id) },
        include: { inspections: true },
    });
    return NextResponse.json(university);
}

// UPDATE university
// app/api/universities/[id]/route.ts
export async function PUT(req: Request, { params }: Params) {
    const { id } = await params;
    const body = await req.json();
    // Remove fields Prisma doesn't allow
    const { id : bodyId, Actions, ...updateData } = body;

    const university = await prisma.university.update({
        where: { id: Number(id) },
        data: updateData,
    });

    return new Response(JSON.stringify(university), { status: 200 });
}


// DELETE university
export async function DELETE(req: Request, { params }: Params) {
    const { id } = await params;
    await prisma.university.delete({
        where: { id: Number(id) },
    });
    return NextResponse.json({ message: "University deleted" });
}
