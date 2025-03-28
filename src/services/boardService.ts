import { BoardWithTasks } from "@/types";

export async function fetchBoard(boardId: string): Promise<BoardWithTasks> {
	const response = await fetch(`/api/boards/${boardId}`);

	if (!response.ok) {
		if (response.status === 404) {
			localStorage.removeItem("lastBoardId");
			throw new Error(`Board has been Deleted / Incorrect Board ID`);
		}
		throw new Error("Failed to fetch board data.");
	}

	return response.json();
}

export async function updateBoard(boardId: string, data: { name: string; description: string }) {
	const response = await fetch(`/api/boards/${boardId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to update board.");
	}

	return response.json();
}

export async function deleteBoard(boardId: string) {
	const response = await fetch(`/api/boards/${boardId}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Failed to delete board.");
	}

	return response.json();
}

export async function createBoard() {
	const response = await fetch("/api/boards", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to create new board");
	}

	return response.json();
}
