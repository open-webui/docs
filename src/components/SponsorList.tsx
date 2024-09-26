import { Sponsor } from "@site/src/components/Sponsors/Sponsor";

export const SponsorList = () => {
	const sponsors = [
		{
			imgSrc: "/sponsors/sponsor.png",
			url: "https://openwebui.com",
			name: "Open WebUI",
			description:
				"On a mission to build the best open-source AI user interface.",
		},
	];

	return (
		<div className="flex flex-wrap items-center justify-center gap-5">
			{sponsors.map((sponsor) => (
				<Sponsor sponsor={sponsor} />
			))}
		</div>
	);
};
