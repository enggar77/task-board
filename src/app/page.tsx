"use client";
import { useState, useEffect, useRef } from "react";
import Loading from "@/components/ui/Loading";
import { createBoard } from "@/services/boardService";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const isInitialMount = useRef(true);

	const handleCreateNewBoard = async () => {
		setError("");
		setLoading(true);

		try {
			const board = await createBoard();

			// save the board ID to localstorage for future visits
			localStorage.setItem("lastBoardId", board.id);

			// redirect to new board page
			router.push(`/board/${board.id}`);
		} catch (error) {
			if (error instanceof Error) setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			const savedBoardId = localStorage.getItem("lastBoardId");
			if (savedBoardId) {
				router.push(`/board/${savedBoardId}`);
			} else {
				handleCreateNewBoard();
			}
		}
	}, [router]);

	return (
		<>
			{isLoading && <Loading message="Creating your board" />}
			{error && (
				<div className="absolute inset-0 flex flex-col gap-4 items-center justify-center">
					<p className="text-2xl">{error}</p>
					<button
						className="bg-black text-white px-4 py-2 rounded-sm cursor-pointer"
						onClick={handleCreateNewBoard}
					>
						Try Again
					</button>
				</div>
			)}
		</>
	);
}
