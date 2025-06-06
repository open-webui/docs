export const TopBanner = ({ item }) => {
	return (
		<div className="pb-4">
			<div className="mb-2">
				<div className="mb-1 text-xs font-semibold text-gray-600 underline dark:text-gray-300">
					Sponsored by {item.name}
				</div>

				<a href={item.url} target="_blank">
					<img
						className="hidden w-full rounded-xl md:block h-18 object-cover" 
						loading="lazy"
						alt={item.name}
						src={item.imgSrc}
					/>

					<img
						className="block w-full rounded-xl md:hidden h-18 object-cover"
						loading="lazy"
						alt={item.name}
						src={item?.mobileImgSrc || item.imgSrc}
					/>
				</a>

				<div className="mt-1 line-clamp-1 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
					{item.description}
				</div>
			</div>
		</div>
	);
};
