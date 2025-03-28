import { Board, Task as TaskType } from "@prisma/client";

export type Icons = "⏰" | "🚀" | "🚫" | "📚" | "💥" | "☕️";
export type Status = "In Progress" | "Completed" | "Won't Do" | "To Do";

export type BoardWithTasks = Board & { tasks: TaskType[] };

export type TaskProps = {
	taskId: string;
	name: string;
	icon?: Icons;
	status: Status;
	description?: string;
	handleShow: (taskId: string) => void;
};

export type BoardDetailsProps = {
	board: BoardWithTasks;
	setHidden: (value: boolean) => void;
	updateBoard: (updatedBoard: BoardWithTasks) => void;
};

export type HeaderProps = {
	board: BoardWithTasks;
	updateBoard: (updatedBoard: BoardWithTasks) => void;
};

export type ShowDetailsProps = {
	children: React.ReactNode;
	handleHide: () => void;
	hidden: boolean;
};

export type LoadingProps = {
	message?: string;
};

export type ButtonProps = {
	type?: "button" | "submit" | "reset";
	disable?: boolean;
	name: string;
	className?: string;
	icon?: React.ReactNode;
	onClick?: () => void;
};
