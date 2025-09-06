import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// GET single employee
export async function GET(req: Request, { params }: Params) {
    const employee = await prisma.employee.findUnique({
        where: { id: Number(params.id) },
        include: { inspections: true },
    });

    if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee);
}

// UPDATE employee
export async function PUT(req: Request, { params }: Params) {
    const body = await req.json();

    const employee = await prisma.employee.update({
        where: { id: Number(params.id) },
        data: {
            name: body.name,
            department: body.department,
        },
    });

    return NextResponse.json(employee);
}

// DELETE employee
export async function DELETE(req: Request, { params }: Params) {
    await prisma.employee.delete({
        where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Employee deleted" });
}
