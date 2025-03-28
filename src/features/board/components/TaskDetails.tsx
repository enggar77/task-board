import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Status, Icons, BoardWithTasks, Task } from "@/types";
import Button from "@/components/ui/Button";
import { createTask, updateTask, deleteTask } from "@/services/taskService";

type FormValues = {
	name: string;
	description: string;
	icon: Icons;
	status: Status;
};

type TaskDetailsProps = {
	selectedTaskId?: string | null;
	board?: BoardWithTasks;
	updateBoard?: (updatedBoard: BoardWithTasks) => void;
	setHidden?: (value: boolean) => void;
};

export default function TaskDetails({
	selectedTaskId,
	board,
	updateBoard,
	setHidden,
}: TaskDetailsProps) {
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState<Icons>("⏰");
	const [selectedStatus, setSelectedStatus] = useState<Status>("To Do");

	const { register, handleSubmit, setValue, reset } = useForm<FormValues>({
		defaultValues: {
			name: "",
			description: "",
			icon: "⏰",
			status: "To Do",
		},
	});

	// Icons available for selection
	const icons: Icons[] = ["⏰", "☕️", "💥", "📚", "🚀", "🚫"];

	// Status options
	const statusOptions: Status[] = [
		"To Do",
		"In Progress",
		"Completed",
		"Won't Do",
	];

	// Find the selected task if editing
	useEffect(() => {
		if (selectedTaskId && board) {
			const task = board.tasks.find(
				(task: Task) => task.id === selectedTaskId
			);
			if (task) {
				setValue("name", task.name);
				setValue("description", task.description || "");
				setSelectedIcon((task.icon as Icons) || "⏰");
				setSelectedStatus(task.status as Status);
				setValue("icon", (task.icon as Icons) || "⏰");
				setValue("status", task.status as Status);
			}
		} else {
			// Reset form for new task
			reset();
			setSelectedIcon("⏰");
			setSelectedStatus("To Do");
		}
	}, [selectedTaskId, board, setValue, reset]);

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (!board || !updateBoard || !setHidden) return;

		try {
			setError("");
			setIsSubmitting(true);

			if (data.name.trim().length === 0) {
				setError("Task name is required");
				return;
			}

			if (data.name.length > 50) {
				setError("Task name should not exceed 50 characters");
				return;
			}

			// Prepare task data
			const taskData = {
				name: data.name.trim(),
				description: data.description.trim(),
				icon: selectedIcon,
				status: selectedStatus,
			};

			let updatedBoard;

			if (selectedTaskId) {
				// Update existing task
				await updateTask(selectedTaskId, taskData);

				// Update the task in the board state
				updatedBoard = {
					...board,
					tasks: board.tasks.map((task: Task) =>
						task.id === selectedTaskId
							? { ...task, ...taskData }
							: task
					),
				};
			} else {
				// Create new task
				const newTask = await createTask(board.id, taskData);

				// Add the new task to the board state
				updatedBoard = {
					...board,
					tasks: [...board.tasks, newTask],
				};
			}

			// Update the board state
			updateBoard(updatedBoard);
			setHidden(true);
		} catch (error) {
			if (error instanceof Error) setError(error.message);
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!board || !updateBoard || !setHidden || !selectedTaskId) return;

		if (!confirm("Are you sure you want to delete this task?")) {
			return;
		}

		try {
			setError("");
			setIsDeleting(true);

			await deleteTask(selectedTaskId);

			// Remove the task from the board state
			const updatedBoard = {
				...board,
				tasks: board.tasks.filter(
					(task: Task) => task.id !== selectedTaskId
				),
			};

			// Update the board state
			updateBoard(updatedBoard);
			setHidden(true);
		} catch (error) {
			if (error instanceof Error) setError(error.message);
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="h-full flex flex-col">
			<h1 className="text-xl font-medium">Task details</h1>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-7 grow flex flex-col justify-between"
			>
				<div className="space-y-7">
					<div className="space-y-1">
						<label
							htmlFor="name"
							className="block text-xs text-gray-3 font-semibold ml-0.5"
						>
							Task name
						</label>
						<input
							id="name"
							{...register("name")}
							className="w-full py-2.5 pl-4 pr-12 rounded-lg border-2 border-gray-1 focus:outline-blue"
							placeholder="Enter task name"
						/>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="description"
							className="block text-xs text-gray-3 font-semibold ml-0.5"
						>
							Description
						</label>
						<textarea
							id="description"
							{...register("description")}
							rows={3}
							placeholder="Enter a short description"
							className="w-full py-2.5 pl-4 pr-12 rounded-lg border-2 border-gray-1 focus:outline-blue"
						/>
					</div>

					<div className="space-y-1">
						<label className="block text-xs text-gray-3 font-semibold ml-0.5">
							Icon
						</label>
						<div className="flex gap-2 overflow-x-scroll px-0.5 py-2">
							{icons.map((icon) => (
								<div
									key={icon}
									className={`w-12 h-12 bg-gray-1 rounded-xl flex items-center justify-center cursor-pointer shrink-0 ${
										selectedIcon === icon
											? "ring-2 ring-blue"
											: ""
									}`}
									onClick={() => {
										setSelectedIcon(icon);
										setValue("icon", icon);
									}}
								>
									<p className="text-xl">{icon}</p>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-1">
						<label className="block text-xs text-gray-3 font-semibold ml-0.5">
							Status
						</label>
						<div className="grid grid-cols-2 gap-2">
							{statusOptions.map((status) => (
								<div
									key={status}
									className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer border-2 border-gray-1 ${
										selectedStatus === status
											? "ring-2 ring-blue"
											: ""
									}`}
									onClick={() => {
										setSelectedStatus(status);
										setValue("status", status);
									}}
								>
									{status === "In Progress" && (
										<div className="bg-orange-3 w-8 h-8 flex items-center justify-center rounded-xl">
											<Image
												src="/Time_atack_duotone.svg"
												height={20}
												width={20}
												alt="in progress"
											/>
										</div>
									)}
									{status === "Completed" && (
										<div className="bg-green-2 w-8 h-8 flex items-center justify-center rounded-xl">
											<Image
												src="/Done_round_duotone.svg"
												height={20}
												width={20}
												alt="completed"
											/>
										</div>
									)}
									{status === "Won't Do" && (
										<div className="bg-red-2 w-8 h-8 flex items-center justify-center rounded-xl">
											<Image
												src="/close_ring_duotone.svg"
												height={20}
												width={20}
												alt="won't do"
											/>
										</div>
									)}
									{status === "To Do" && (
										<div className="bg-gray-3 w-8 h-8 flex items-center justify-center rounded-xl">
											<Image
												src="/Add_round_duotone.svg"
												height={20}
												width={20}
												alt="won't do"
											/>
										</div>
									)}
									<span className="font-medium text-sm">
										{status}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div
					className={`flex items-center ${
						error ? "justify-between" : "justify-end "
					}`}
				>
					{error && <p className="text-red-2 text-xs">{error}</p>}

					<div className="flex gap-4 items-center">
						{selectedTaskId && (
							<Button
								type="button"
								disable={isDeleting || isSubmitting}
								name={isDeleting ? "Deleting.." : "Delete"}
								className="bg-gray-3"
								icon={
									<Image
										src="/Trash.svg"
										alt="trash"
										width={18}
										height={18}
									/>
								}
								onClick={handleDelete}
							/>
						)}
						<Button
							type="submit"
							disable={isDeleting || isSubmitting}
							name={
								isSubmitting
									? selectedTaskId
										? "Updating..."
										: "Saving..."
									: selectedTaskId
									? "Update"
									: "Save"
							}
							className="bg-blue"
							icon={
								<Image
									src="/Done_round.svg"
									alt="done"
									width={18}
									height={18}
								/>
							}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
