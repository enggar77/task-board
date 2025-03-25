"use client";
import { useState, useEffect, useRef } from "react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const isInitialMount = useRef(true);

	const createNewBoard = async () => {
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api/boards", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to create new board");
			}

			const board = await response.json();

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
				createNewBoard();
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
						onClick={createNewBoard}
					>
						Try Again
					</button>
				</div>
			)}
		</>
	);
}
