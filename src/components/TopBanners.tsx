import { TopBanner } from "@site/src/components/Sponsors/TopBanner";
import { useEffect, useState } from "react";

export const TopBanners = ({
	bannerClassName = "h-18",
	label = true,
	description = true,
	mobile = true,
}) => {
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

	return (
		<TopBanner
			bannerClassName={bannerClassName}
			item={items[selectedItemIdx]}
			label={label}
			description={description}
			mobile={mobile}
		/>
	);
};
