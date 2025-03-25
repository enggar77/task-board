import { Board, Task } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

type Props = {
	board: Board & { tasks: Task[] };
	setHidden: (value: boolean) => void;
	updateBoard: (updatedBoard: Board & { tasks: Task[] }) => void;
};

type FormValues = {
	name: string;
	description: string;
};

export default function BoardDetails({ board, updateBoard, setHidden }: Props) {
	const { name, description, tasks, id, updatedAt } = board;
	const { register, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			name,
			description,
		},
	});
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const [tooltip, setTooltip] = useState(false);
	const [error, setError] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const router = useRouter();

	const boardUrl = `${origin}/board/${id}`;
	const lastUpdated = new Date(updatedAt)
		.toLocaleString("id", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		})
		.replace(",", " -");

	const handleCopyUrl = () => {
		navigator.clipboard.writeText(boardUrl);
		setTooltip(true);
		setTimeout(() => {
			setTooltip(false);
		}, 2000);
	};

	const onsubmit: SubmitHandler<FormValues> = async (data) => {
		const updatedData = {
			name: data.name.trim() || name,
			description: data.description.trim() || description,
		};

		if (
			updatedData.name === name &&
			updatedData.description === description
		) {
			setHidden(true);
			return;
		}

		try {
			setError("");
			setIsUpdating(true);

			if (updatedData.name.length > 50) {
				setError("Title should not exceed 50 characters.");
				return;
			}

			const sendUpdateBoard = await fetch(`/api/boards/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			});
			// fetch the updated board
			const getUpdatedBoard = await fetch(`/api/boards/${id}`);

			if (!sendUpdateBoard.ok || !getUpdatedBoard.ok)
				throw new Error("Failed to update board.");

			const updatedBoard = await getUpdatedBoard.json();
			updateBoard(updatedBoard);
			setHidden(true);
		} catch (error) {
			if (error instanceof Error) setError(error.message);
			console.error(error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this board? All data will be erased."
			)
		) {
			return;
		}
		try {
			setIsDeleting(true);
			const response = await fetch(`/api/boards/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error("Failed to delete board.");

			router.push("/");
		} catch (error) {
			if (error instanceof Error) setError(error.message);
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="min-h-full flex flex-col">
			<h1 className="text-xl font-medium mb-2">Board Details</h1>
			<p className="text-sm text-gray-3">Last Updated: {lastUpdated}</p>
			<p className="mb-10 text-sm text-gray-3">
				Total Tasks: {tasks.length}
			</p>

			<div className="flex flex-col relative space-y-1 mb-5">
				<label className="text-xs text-gray-3 font-medium pl-0.5">
					Board URL:
				</label>
				<input
					defaultValue={boardUrl}
					readOnly
					className="px-4 py-2 border bg-gray-1 text-black/50 border-gray-1 pr-11 rounded-lg"
				/>
				<button
					className="absolute right-3 top-7.5 text-gray-3 cursor-pointer"
					onClick={handleCopyUrl}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M3 16V4C3 2.89543 3.89543 2 5 2H15M9 22H18C19.1046 22 20 21.1046 20 20V8C20 6.89543 19.1046 6 18 6H9C7.89543 6 7 6.89543 7 8V20C7 21.1046 7.89543 22 9 22Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
				{tooltip && (
					<span className="absolute top-0 right-0 text-xs text-blue">
						Copied!
					</span>
				)}
			</div>

			<form
				onSubmit={handleSubmit(onsubmit)}
				className="flex-grow flex flex-col justify-between"
			>
				<div>
					<div className="flex flex-col space-y-1 mb-5">
						<label className="text-xs text-gray-3 font-medium pl-0.5">
							Title
						</label>
						<input
							{...register("name")}
							className="border-2 border-gray-1 rounded-lg px-4 py-2 placeholder:text-gray-3"
							placeholder="Enter your board title"
						/>
					</div>
					<div className="flex flex-col space-y-1">
						<label className="text-xs text-gray-3 font-medium pl-0.5">
							Description
						</label>
						<input
							{...register("description")}
							className="border-2 border-gray-1 rounded-lg px-4 py-2 placeholder:text-gray-3"
							placeholder="Enter your board description"
						/>
					</div>
				</div>

				<div
					className={`flex items-center ${
						error ? "justify-between" : "self-end"
					}`}
				>
					{error && <p className="text-red-2 text-sm">{error}</p>}
					<div className="flex gap-3">
						<button
							type="button"
							className="cursor-pointer px-4 py-1.5 bg-gray-3 text-sm font-medium text-white rounded-2xl flex gap-1.5 items-center"
							onClick={handleDelete}
						>
							<span>{isDeleting ? "Deleting..." : "Delete"}</span>
							<Image
								src="/Trash.svg"
								alt="delete"
								height={18}
								width={18}
							/>
						</button>
						<button
							type="submit"
							className="cursor-pointer px-4 py-1.5 bg-blue text-sm font-medium text-white rounded-2xl flex gap-1.5 items-center"
						>
							<span>{isUpdating ? "Updating..." : "Update"}</span>
							<Image
								src="/Done_round.svg"
								alt="delete"
								height={18}
								width={18}
							/>
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
