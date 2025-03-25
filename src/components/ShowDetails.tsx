import Image from "next/image";

export default function ShowDetails({
	children,
	handleHide,
	hidden,
	setHidden,
}: {
	children: React.ReactNode;
	handleHide: () => void;
	hidden: boolean;
	setHidden: (value: boolean) => void;
}) {
	return (
		<>
			<div
				className={`absolute transition-all duration-500 ${
					hidden ? "" : "inset-0 bg-black/40"
				}`}
				onClick={handleHide}
			/>

			<div
				className={`absolute w-[600px] h-[calc(100%-32px)] bg-white rounded-xl m-4 right-0 top-0 p-6 transition-all duration-300 ${
					hidden ? "translate-x-[150%]" : ""
				}`}
			>
				{children}
				<button
					className="absolute right-6 top-6 w-fit h-fit cursor-pointer"
					onClick={() => setHidden(true)}
				>
					<Image
						src="/close_ring_duotone-1.svg"
						height={24}
						width={24}
						alt="close icon"
					/>
				</button>
			</div>
		</>
	);
}
