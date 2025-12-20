import { SidebarBanner } from "@site/src/components/Sponsors/SidebarBanner";
import { useEffect, useState } from "react";

export const SidebarBanners = () => {
	const items = [
		{
			imgSrc: '/sponsors/banners/openwebui-banner.png',
			mobileImgSrc: '/sponsors/banners/openwebui-banner-mobile.png',
			url: 'https://docs.openwebui.com/enterprise',
			name: 'Open WebUI Inc.',
			description:
				'Upgrade to a licensed plan for enhanced capabilities, including custom theming and branding, and dedicated support.'
		},
		{
			imgSrc: '/sponsors/banners/openwebui-banner.png',
			mobileImgSrc: '/sponsors/banners/openwebui-banner-mobile.png',
			url: 'https://careers.openwebui.com',
			name: 'Open WebUI Inc.',
			description: '**We are hiring!** Shape the way humanity engages with _intelligence_.'
		},
	];

	// Randomly select an item to display
	const [selectedItemIdx, setSelectedItemIdx] = useState(
		Math.floor(Math.random() * items.length)
	);

	useEffect(() => {
		// After mounting update every 5 seconds
		setInterval(() => {
			setSelectedItemIdx(Math.floor(Math.random() * items.length));
		}, 10000); // 10000 ms = 10 seconds
	}, []);

	return <SidebarBanner item={items[selectedItemIdx]} />;
};
