import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Task } from "@prisma/client";

// GET all tasks (optionally filtered by boardId)
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const boardId = searchParams.get("boardId");

	try {
		const whereClause = boardId ? { boardId } : {};

		const tasks = await prisma.task.findMany({
			where: whereClause,
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(tasks);
	} catch (error) {
		console.error("Error fetching tasks:", error);
		return NextResponse.json(
			{ error: "Failed to fetch tasks" },
			{ status: 500 }
		);
	}
}

// CREATE a new task
export async function POST(request: NextRequest) {
	try {
		const { name, description, icon, status, boardId } =
			await request.json();

		if (!boardId) {
			return NextResponse.json(
				{ error: "Board ID is required" },
				{ status: 400 }
			);
		}

		const task: Task = await prisma.task.create({
			data: {
				name,
				description,
				icon,
				status,
				board: {
					connect: {
						id: boardId,
					},
				},
			},
		});

		return NextResponse.json(task, { status: 201 });
	} catch (error) {
		console.error("Error creating task:", error);
		return NextResponse.json(
			{ error: "Failed to create task" },
			{ status: 500 }
		);
	}
}
