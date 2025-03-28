import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prismaClient";

// GET a board by ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ boardId: string }> }
) {
	const { boardId } = await params;

	try {
		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
			},
			include: {
				tasks: true,
			},
		});

		if (!board) {
			return NextResponse.json(
				{ error: "Board not found." },
				{ status: 404 }
			);
		}

		return NextResponse.json(board);
	} catch (error) {
		console.error("Error fetching board:", error);
		return NextResponse.json(
			{ error: "Failed to fetch board." },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ boardId: string }> }
) {
	const { boardId } = await params;

	try {
		const { name, description } = await request.json();

		const updatedBoard = await prisma.board.update({
			where: {
				id: boardId,
			},
			data: {
				name,
				description,
			},
			include: {
				tasks: true,
			},
		});

		return NextResponse.json(updatedBoard);
	} catch (error) {
		console.error("Error updating board:", error);
		return NextResponse.json(
			{ error: "Failed to update board" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ boardId: string }> }
) {
	const { boardId } = await params;

	try {
		await prisma.board.delete({
			where: {
				id: boardId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting board:", error);
		return NextResponse.json(
			{ error: "Failed to delete board" },
			{ status: 500 }
		);
	}
}
