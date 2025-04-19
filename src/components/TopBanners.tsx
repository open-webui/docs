import { TopBanner } from "@site/src/components/Sponsors/TopBanner";

export const TopBanners = () => {
	const items = [
		{
			imgSrc: "/sponsors/banners/openwebui-banner.png",
			mobileImgSrc: "/sponsors/banners/openwebui-banner-mobile.png",
			url: "https://openwebui.com",
			name: "Open WebUI Community",
			description:
				"Join our growing community! Sign up to gain access to exclusive models, tools, and functions.",
		},
		{
			imgSrc: "/sponsors/banners/placeholder.png",
			mobileImgSrc: "/sponsors/banners/placeholder-mobile.png",
			url: "https://forms.gle/92mvG3ESYj47zzRL9",
			name: "Open WebUI",
			description:
				"The top banner spot is reserved for Emerald+ Enterprise sponsors on a first-come, first-served basis",
		},
	];

	// Randomly select an item to display
	let selectedItemIdx = Math.floor(Math.random() * items.length);

	return <TopBanner items={[items[selectedItemIdx]]} />;
};
