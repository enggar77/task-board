"use client";

import Image from "next/image";
import { TaskProps } from "@/types";

export default function Task({
	taskId,
	name,
	icon,
	status,
	description,
	handleShow,
}: TaskProps) {
	return (
		<div
			className={`${
				status === "In Progress"
					? "bg-orange-2"
					: status === "Completed"
					? "bg-green-1"
					: status === "Won't Do"
					? "bg-red-1"
					: "bg-gray-1"
			} flex justify-between items-center px-4.5 py-3.5 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200`}
			onClick={() => handleShow(taskId)}
		>
			<div className="">
				<div className="flex gap-6 items-center">
					<div className="bg-white rounded-xl flex items-center justify-center w-12 h-12">
						<p className="text-xl">{icon}</p>
					</div>
					<h2 className="text-xl font-semibold">{name}</h2>
				</div>
				<p className={`ml-[75px] font-light ${description && "mb-2"}`}>
					{description}
				</p>
			</div>

			{status !== "To Do" && (
				<div
					className={`${
						status === "In Progress"
							? "bg-orange-3"
							: status === "Completed"
							? "bg-green-2"
							: "bg-red-2"
					}
				w-12 h-12 flex items-center justify-center rounded-xl`}
				>
					<Image
						src={
							status === "In Progress"
								? "/Time_atack_duotone.svg"
								: status === "Completed"
								? "/Done_round_duotone.svg"
								: status === "Won't Do"
								? "/close_ring_duotone.svg"
								: ""
						}
						height={24}
						width={24}
						alt={status}
					/>
				</div>
			)}
		</div>
	);
}
