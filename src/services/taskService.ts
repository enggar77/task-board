import { Task } from "@prisma/client";

export async function fetchTasks(boardId: string): Promise<Task[]> {
	const response = await fetch(`/api/tasks?boardId=${boardId}`);

	if (!response.ok) {
		throw new Error("Failed to fetch tasks.");
	}

	return response.json();
}

export async function fetchTask(taskId: string): Promise<Task> {
	const response = await fetch(`/api/tasks/${taskId}`);

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error(`Task not found`);
		}
		throw new Error("Failed to fetch task data.");
	}

	return response.json();
}

export async function createTask(
	boardId: string,
	data: { name: string; description: string; icon: string; status: string }
): Promise<Task> {
	const response = await fetch(`/api/tasks`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ...data, boardId }),
	});

	if (!response.ok) {
		throw new Error("Failed to create task.");
	}

	return response.json();
}

export async function updateTask(
	taskId: string,
	data: { name: string; description: string; icon: string; status: string }
): Promise<Task> {
	const response = await fetch(`/api/tasks/${taskId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to update task.");
	}

	return response.json();
}

export async function deleteTask(taskId: string): Promise<void> {
	const response = await fetch(`/api/tasks/${taskId}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Failed to delete task.");
	}

	return response.json();
}
