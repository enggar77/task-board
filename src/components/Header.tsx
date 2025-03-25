import Image from "next/image";
import BoardDetails from "./BoardDetails";
import ShowDetails from "./ShowDetails";
import { useState } from "react";
import { Board, Task as TaskType } from "@prisma/client";

type Props = {
	board: Board & { tasks: TaskType[] };
	updateBoard: (updatedBoard: Board & { tasks: TaskType[] }) => void;
};

export default function Header({ board, updateBoard }: Props) {
	const [hidden, setHidden] = useState(true);

	function handleShow() {
		setHidden(false);
	}

	function handleHide() {
		setHidden(true);
	}

	return (
		<header className="flex items-start gap-3">
			<ShowDetails
				handleHide={handleHide}
				hidden={hidden}
				setHidden={setHidden}
			>
				<BoardDetails
					board={board}
					setHidden={setHidden}
					updateBoard={updateBoard}
				/>
			</ShowDetails>

			<Image src="/Logo.svg" alt="logo svg" width={"40"} height={"40"} />
			<div className="space-y-2">
				<div className="flex items-center gap-5">
					<h1 className="text-4xl">{board.name}</h1>
					<button
						className="cursor-pointer w-fit shrink-0"
						onClick={handleShow}
					>
						<Image
							src="/Edit_duotone.svg"
							alt="edit svg"
							width={"24"}
							height={"24"}
						/>
					</button>
				</div>
				<p>{board.description}</p>
			</div>
		</header>
	);
}
