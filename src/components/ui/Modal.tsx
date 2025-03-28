import Image from "next/image";
import { ShowDetailsProps } from "@/types";

export default function Modal({ children, handleHide, hidden }: ShowDetailsProps) {
	return (
		<>
			<div
				className={`fixed inset-0 transition-opacity duration-500 ${
					hidden ? "opacity-0 pointer-events-none" : "opacity-100 bg-black/40"
				}`}
				onClick={handleHide}
			/>

			<div
				className={`fixed w-[calc(100%-32px)] max-w-[600px] h-[calc(100%-32px)] bg-white rounded-xl m-4 right-0 top-0 p-6 transition-all duration-300 ${
					hidden ? "translate-x-[150%]" : ""
				}`}
			>
				{children}
				<button className="absolute right-6 top-6 w-fit h-fit cursor-pointer" onClick={handleHide}>
					<Image src="/close_ring_duotone-1.svg" height={24} width={24} alt="close icon" />
				</button>
			</div>
		</>
	);
}
