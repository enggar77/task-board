import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Board } from "@prisma/client";

// GET a board by ID
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ boardId: string }> }
) {
	try {
		const { boardId } = await params;

		const board: Board | null = await prisma.board.findUnique({
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
