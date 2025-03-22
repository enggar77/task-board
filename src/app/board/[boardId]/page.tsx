"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Task from "@/components/Task";
import Loading from "@/components/Loading";
import { Board, Task as TaskType } from "@prisma/client";
import { Status } from "@/lib/defenition";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BoardPage() {
	const params = useParams<{ boardId: string }>();
	const [board, setBoard] = useState<Board & { tasks: TaskType[] }>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchBoard = async () => {
			setLoading(true);
			setError("");

			try {
				const response = await fetch(`/api/boards/${params.boardId}`);

				if (!response.ok) {
					if (response.status === 404) {
						localStorage.removeItem("lastBoardId");
						throw new Error(
							`No board found with id ${params.boardId}`
						);
					}
					throw new Error("Failed to fetch board data.");
				}

				const data: Board & { tasks: TaskType[] } =
					await response.json();
				setBoard(data);
				// Save the board ID to localStorage
				localStorage.setItem("lastBoardId", params.boardId);
			} catch (error) {
				if (error instanceof Error) setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (params.boardId) fetchBoard();
	}, [params.boardId]);

	if (loading) return <Loading />;

	if (error) {
		return (
			<div className="absolute inset-0 flex flex-col gap-4 items-center justify-center">
				<p className="text-2xl">{error}</p>
				<Link
					className="bg-black text-white px-4 py-1 rounded-sm cursor-pointer"
					href={"/"}
				>
					Homepage
				</Link>
			</div>
		);
	}

	return (
		<div className="mt-16 space-y-8">
			<Header
				name={board?.name || "My Task Board"}
				description={board?.description || "Tasks to keep organized"}
			/>

			<div className="space-y-5">
				{board?.tasks.map((task) => (
					<Task
						key={task.id}
						status={task.status as Status}
						icon={task.icon ?? undefined}
						name={task.name}
					/>
				))}
			</div>
		</div>
	);
}
