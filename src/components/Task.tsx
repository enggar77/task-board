import Image from "next/image";
import { Status } from "@/lib/defenition";

type Props = {
	name: string;
	icon?: string;
	status: Status;
	description?: string;
};

export default function Task({ name, icon, status, description }: Props) {
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
			} flex justify-between items-center px-4.5 py-3.5 rounded-xl cursor-pointer`}
		>
			<div className="max-w-[450px]">
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

			<div
				className={`${
					status === "In Progress"
						? "bg-orange-3"
						: status === "Completed"
						? "bg-green-2"
						: status === "Won't Do"
						? "bg-red-2"
						: "bg-gray-3"
				}
				w-12 h-12 flex items-center justify-center rounded-xl`}
			>
				{status !== "To Do" && (
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
						height={"20"}
						width={"20"}
						alt={status}
					/>
				)}
			</div>
		</div>
	);
}
