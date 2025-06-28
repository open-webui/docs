import { TopBanner } from "@site/src/components/Sponsors/TopBanner";
import { useEffect, useState } from "react";

export const Testimonals = ({
	bannerClassName = "h-18",
	label = true,
	description = true,
	mobile = true,
}) => {
	const items = [
		{
			imgSrc: "https://avatars.githubusercontent.com/u/5860369?v=4",
			url: "https://github.com/Ithanil/",
			name: "Jan Kessler, AI Architect",
			company: "JGU Mainz",
			content:
				"Deploying an self-hosted AI chat stack for a large university like the Johannes Gutenberg University Mainz demands scalable and seamlessly integrable solutions. As the AI Architect at the university's Data Center, I chose Open WebUI as our chat frontend, impressed by its out-of-the-box readiness for enterprise environments and its rapidly paced, community-driven development. Now, our fully open-source stack – comprising LLMs, proxy/loadbalancer, and frontend – is successfully serving our user base of 30,000+ students and 5,000+ employees, garnering very positive feedback. Open WebUI’s user-centric design, rich feature set, and adaptability have solidified it as an outstanding choice for our institution.",
		},
	];

	return (
		<>
			{items.map((item, index) => (
				<div key={index} className="flex items-center gap-6 py-6 text-center">
					<div className="flex shrink-0 basis-1/4 flex-col items-center">
						<a href={item.url} target="_blank" rel="noopener noreferrer">
							<div>
								<img
									src={item.imgSrc}
									alt={item.name}
									className="mb-2 size-20 rounded-full"
								/>
							</div>

							<div className="text-sm font-medium no-underline hover:underline">
								{item.name}
							</div>
							<div className="text-sm font-medium no-underline hover:underline">
								@ {item.company}
							</div>
						</a>
					</div>
					<p className="text-sm italic">{item.content}</p>
				</div>
			))}
		</>
	);
};
