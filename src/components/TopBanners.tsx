import { TopBanner } from "@site/src/components/Sponsors/TopBanner";

export const TopBanners = () => {
	const items = [
		{
			imgSrc: "/ads/pipelines-banner.png",
			mobileImgSrc: "/ads/pipelines-banner-mobile.png",
			url: "https://github.com/open-webui/pipelines",
			name: "Open WebUI Pipelines",
			description:
				"Pipelines: Versatile, UI-Agnostic OpenAI-Compatible Plugin Framework",
		},
		{
			imgSrc: "/ads/sponsor-banner-1.png",
			mobileImgSrc: "/ads/sponsor-banner-small-1.png",
			url: "https://davewaring.com/tag/digital-brain-building/",
			name: "Dave Waring",
			description: "Follow along as I build my own AI powered digital brain.",
		},
	];

	// Randomly select an item to display
	let selectedItemIdx = Math.floor(Math.random() * items.length);

	return <TopBanner items={[items[selectedItemIdx]]} />;
};
