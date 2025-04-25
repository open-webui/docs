import { TopBanner } from "@site/src/components/Sponsors/TopBanner";

export const TopBanners = () => {
	const items = [
		{
			imgSrc: "/sponsors/banners/n8n-banner.png",
			mobileImgSrc: "/sponsors/banners/n8n-banner-mobile.png",
			url: "https://n8n.io/",
			name: "n8n",
			description:
				"Does your interface have a backend yet? Try n8n",
		},
		{
			imgSrc: "/sponsors/banners/placeholder.png",
			mobileImgSrc: "/sponsors/banners/placeholder-mobile.png",
			url: "https://forms.gle/92mvG3ESYj47zzRL9",
			name: "Open WebUI",
			description:
				"The top banner spot is reserved for Emerald+ Enterprise sponsors",
		},
	];

	// Randomly select an item to display
	let selectedItemIdx = Math.floor(Math.random() * items.length);

	return <TopBanner items={[items[selectedItemIdx]]} />;
};
