import { TopBanner } from "@site/src/components/Sponsors/TopBanner";
import { useEffect, useState } from "react";

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
			imgSrc: "/sponsors/banners/n8n-banner.png",
			mobileImgSrc: "/sponsors/banners/n8n-banner-mobile.png",
			url: "https://n8n.io/",
			name: "n8n",
			description:
				"Does your interface have a backend yet? Try n8n",
		},

		{
			imgSrc: "/sponsors/banners/warp-banner.png",
			mobileImgSrc: "/sponsors/banners/warp-banner-mobile.png",
			url: "https://warp.dev/open-webui",
			name: "Warp",
			description:
				"The intelligent terminal for developers",
		},

		{
			imgSrc: "/sponsors/banners/warp-banner.png",
			mobileImgSrc: "/sponsors/banners/warp-banner-mobile.png",
			url: "https://warp.dev/open-webui",
			name: "Warp",
			description:
				"The intelligent terminal for developers",
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
	const [selectedItemIdx, setSelectedItemIdx] = useState(Math.floor(Math.random() * items.length));

	useEffect(() => {
		// After mounting update every 5 seconds
		setInterval(() => {
			setSelectedItemIdx(Math.floor(Math.random() * items.length));
		}, 10000); // 10000 ms = 10 seconds
	}, []);


	return <TopBanner item={items[selectedItemIdx]} />;
};
