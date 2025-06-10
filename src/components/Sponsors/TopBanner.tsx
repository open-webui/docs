export const TopBanner = ({item, bannerClassName = 'h-18 ', label = true, description= true,mobile = true }) => {
	return (
		<div className="w-full">
			<div className="flex flex-col justify-center w-full">
				{label &&
				<div className="mb-1 text-xs font-semibold text-gray-600 underline dark:text-gray-300">
					Sponsored by {item.name}
				</div>
				}

				<a href={item.url} target="_blank" className="flex items-center justify-center w-full">

					{mobile ? <>
								<img
									className={`hidden md:block w-full rounded-xl object-cover ${bannerClassName}`}
									loading="lazy"
									alt={item.name}
									src={item.imgSrc}
								/>

								<img
									className={`block w-full rounded-xl md:hidden object-cover ${bannerClassName}`}
									loading="lazy"
									alt={item.name}
									src={item?.mobileImgSrc || item.imgSrc}
								/>
					</> : <>

					<img
						className={`w-full rounded-xl object-cover ${bannerClassName}`}
						loading="lazy"
						alt={item.name}
						src={item.imgSrc}
					/>

					</> }
				</a>

				{description &&

				<div className="mt-1 line-clamp-1 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
					{item.description}
				</div>
}
			</div>
		</div>
	);
};
