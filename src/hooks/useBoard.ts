import { useState, useEffect } from "react";
import { BoardWithTasks } from "@/types";

export function useBoard(boardId: string) {
	const [board, setBoard] = useState<BoardWithTasks>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchBoard = async () => {
			setLoading(true);
			setError("");

			try {
				const response = await fetch(`/api/boards/${boardId}`);

				if (!response.ok) {
					if (response.status === 404) {
						localStorage.removeItem("lastBoardId");
						throw new Error(
							`Board has been Deleted / Incorrect Board ID`
						);
					}
					throw new Error("Failed to fetch board data.");
				}

				const data: BoardWithTasks = await response.json();
				setBoard(data);
				// Save the board ID to localStorage
				if (data?.id) localStorage.setItem("lastBoardId", data.id);
			} catch (error) {
				if (error instanceof Error) setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (boardId) fetchBoard();
	}, [boardId]);

	const updateBoard = (updatedBoard: BoardWithTasks) => {
		setBoard(updatedBoard);
	};

	return { board, loading, error, updateBoard };
}
