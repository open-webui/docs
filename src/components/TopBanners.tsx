import { TopBanner } from "@site/src/components/Sponsors/TopBanner";

export const TopBanners = () => {
	const items = [
		{
			imgSrc: "/ads/openwebui-banner.png",
			mobileImgSrc: "/ads/openwebui-banner-mobile.png",
			url: "https://openwebui.com",
			name: "Open WebUI Community",
			description:
				"Join our growing community! Sign up to gain access to exclusive models, tools, and functions.",
		},
		{
			imgSrc: "/ads/placeholder.png",
			mobileImgSrc: "/ads/placeholder-mobile.png",
			url: "mailto:sales@openwebui.com?subject=Sponsorship Inquiry: Open WebUI",
			name: "Open WebUI",
			description:
				"The top banner spot is reserved for only two Enterprise sponsors on a first-come, first-served basis",
		},
	];

	// Randomly select an item to display
	let selectedItemIdx = Math.floor(Math.random() * items.length);

	return <TopBanner items={[items[selectedItemIdx]]} />;
};
