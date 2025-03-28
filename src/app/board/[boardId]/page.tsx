"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Status, Icons } from "@/types";

// Hooks
import { useBoard } from "@/hooks/useBoard";

// Components
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/Modal";
import Header from "@/features/board/components/Header";
import Task from "@/features/board/components/Task";
import TaskDetails from "@/features/board/components/TaskDetails";

export default function BoardPage() {
	const params = useParams();
	const boardId = params.boardId as string;
	const { board, loading, error, updateBoard } = useBoard(boardId);
	const [hidden, setHidden] = useState(true);
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

	// Sort tasks by status priority: In Progress > To Do > Completed > Won't Do
	const sortedTasks = useMemo(() => {
		const getStatusPriority = (status: Status): number => {
			switch (status) {
				case "In Progress":
					return 1;
				case "To Do":
					return 2;
				case "Won't Do":
					return 3;
				case "Completed":
					return 4;
				default:
					return 5;
			}
		};

		return [...(board?.tasks || [])].sort((a, b) => {
			return (
				getStatusPriority(a.status as Status) -
				getStatusPriority(b.status as Status)
			);
		});
	}, [board?.tasks]);

	function handleShow(taskId: string) {
		setSelectedTaskId(taskId);
		setHidden(false);
	}

	function handleHide() {
		setHidden(true);
		setSelectedTaskId(null);
	}

	if (loading) return <Loading />;

	if (error) {
		return (
			<div className="absolute inset-0 flex flex-col gap-4 items-center justify-center">
				<p className="text-2xl">{error}</p>
				<Link
					className="bg-black text-white px-4 py-2 rounded-sm cursor-pointer"
					href={"/"}
				>
					Create New Board
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="mt-16 mb-5 space-y-8">
				{board && <Header board={board} updateBoard={updateBoard} />}

				<div className="space-y-5 max-h-[450px] overflow-y-scroll px-2 py-4">
					{sortedTasks.map((task) => (
						<Task
							key={task.id}
							taskId={task.id}
							status={task.status as Status}
							icon={task.icon as Icons}
							name={task.name}
							handleShow={handleShow}
							description={task.description || ""}
						/>
					))}
				</div>

				<button
					className="flex items-center px-4.5 py-3.5 rounded-xl cursor-pointer bg-orange-1 w-[calc(100%-16px)] mx-2 shadow-md hover:shadow-lg transition-shadow duration-200"
					onClick={() => {
						setHidden(false);
						setSelectedTaskId(null);
					}}
				>
					<div className="flex gap-6 items-center">
						<div className="bg-orange-3 rounded-xl flex items-center justify-center p-3.5">
							<Image
								src="/Add_round_duotone.svg"
								alt="add task"
								height={24}
								width={24}
							/>
						</div>
						<h2 className="text-md font-semibold">Add new task</h2>
					</div>
				</button>
			</div>
			<Modal handleHide={handleHide} hidden={hidden}>
				<TaskDetails
					selectedTaskId={selectedTaskId}
					board={board}
					updateBoard={updateBoard}
					setHidden={setHidden}
				/>
			</Modal>
		</>
	);
}
