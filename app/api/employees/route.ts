import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all employees
export async function GET() {
    const employees = await prisma.employee.findMany({
        include: { inspections: true },
    });
    return NextResponse.json(employees);
}

// POST new employee
export async function POST(req: Request) {
    const body = await req.json();
    const employee = await prisma.employee.create({
        data: {
            name: body.name,
            department: body.department,
        },
    });
    return NextResponse.json(employee);
}
