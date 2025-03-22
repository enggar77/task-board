import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { Board } from "@prisma/client";

// CREATE a new board
export async function POST() {
	try {
		const board: Board = await prisma.board.create({
			data: {
				tasks: {
					create: [
						{
							name: "Task In Progress",
							status: "In Progress",
							icon: "⏰",
						},
						{
							name: "Task Completed",
							status: "Completed",
							icon: "🚀",
						},
						{
							name: "Task Won't Do",
							status: "Won't Do",
							icon: "🚫",
						},
					],
				},
			},
			include: {
				tasks: true,
			},
		});
		return NextResponse.json(board, { status: 201 });
	} catch (error) {
		console.error("Error creating board:", error);
		return NextResponse.json(
			{ error: "Failed to create new board" },
			{ status: 500 }
		);
	}
}
