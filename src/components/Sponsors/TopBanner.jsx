export const TopBanner = ({ items }) => {
	return (
		<div className="pb-4">
			{items.map((item) => (
				<>
					<div className="mb-2">
						<div className="text-xs text-gray-500 dark:text-gray-400 font-bold underline mb-1">
							Sponsored by {item.name}
						</div>

						<a href={item.url} target="_blank">
							<img
								className="w-full rounded-xl hidden md:block"
								loading="lazy"
								alt={item.name}
								src={item.imgSrc}
							/>

							<img
								className="w-full rounded-xl block md:hidden"
								loading="lazy"
								alt={item.name}
								src={item?.mobileImgSrc || item.imgSrc}
							/>
						</a>

						<div className="text-right text-[0.6rem] text-gray-500 dark:text-gray-400 font-bold  line-clamp-1">
							{item.description}
						</div>
					</div>
				</>
			))}
		</div>
	);
};
