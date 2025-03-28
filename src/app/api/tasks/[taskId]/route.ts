import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Task } from "@prisma/client";

// GET a task by ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	const { taskId } = await params;

	try {
		const task: Task | null = await prisma.task.findUnique({
			where: {
				id: taskId,
			},
		});

		if (!task) {
			return NextResponse.json(
				{ error: "Task not found." },
				{ status: 404 }
			);
		}

		return NextResponse.json(task);
	} catch (error) {
		console.error("Error fetching task:", error);
		return NextResponse.json(
			{ error: "Failed to fetch task." },
			{ status: 500 }
		);
	}
}

// UPDATE a task by ID
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	const { taskId } = await params;

	try {
		const { name, description, icon, status } = await request.json();

		const updatedTask = await prisma.task.update({
			where: {
				id: taskId,
			},
			data: {
				name,
				description,
				icon,
				status,
			},
		});

		return NextResponse.json(updatedTask);
	} catch (error) {
		console.error("Error updating task:", error);
		return NextResponse.json(
			{ error: "Failed to update task." },
			{ status: 500 }
		);
	}
}

// DELETE a task by ID
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> }
) {
	const { taskId } = await params;

	try {
		await prisma.task.delete({
			where: {
				id: taskId,
			},
		});

		return NextResponse.json({ message: "Task deleted successfully." });
	} catch (error) {
		console.error("Error deleting task:", error);
		return NextResponse.json(
			{ error: "Failed to delete task." },
			{ status: 500 }
		);
	}
}
