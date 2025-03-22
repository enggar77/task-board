import Image from "next/image";

type Props = {
	name: string;
	description: string;
};

export default function Header({ name, description }: Props) {
	return (
		<header className="flex items-start gap-3">
			<Image src="/Logo.svg" alt="logo svg" width={"40"} height={"40"} />
			<div className="space-y-2">
				<div className="flex items-center gap-5">
					<h1 className="text-4xl">{name}</h1>
					<button className="cursor-pointer">
						<Image
							src="/Edit_duotone.svg"
							alt="edit svg"
							width={"24"}
							height={"24"}
						/>
					</button>
				</div>
				<p>{description}</p>
			</div>
		</header>
	);
}
