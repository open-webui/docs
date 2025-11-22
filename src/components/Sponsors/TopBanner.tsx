import {marked} from 'marked';

export const TopBanner = ({
	item,
	bannerClassName = "h-18 ",
	label = true,
	description = true,
	mobile = true,
}) => {
	return (
		<div className="w-full">
			<div className="flex w-full flex-col justify-center">
				{label && (
					<div className="mb-1 text-xs font-semibold text-gray-600 underline dark:text-gray-300">
						Sponsored by {item.name}
					</div>
				)}

				<a
					href={item.url}
					target="_blank"
					className="flex w-full items-center justify-center"
				>
					{mobile ? (
						<>
							<img
								className={`hidden w-full rounded-xl object-cover md:block ${bannerClassName}`}
								loading="lazy"
								alt={item.name}
								src={item.imgSrc}
							/>

							<img
								className={`block w-full rounded-xl object-cover md:hidden ${bannerClassName}`}
								loading="lazy"
								alt={item.name}
								src={item?.mobileImgSrc || item.imgSrc}
							/>
						</>
					) : (
						<>
							<img
								className={`w-full rounded-xl object-cover ${bannerClassName}`}
								loading="lazy"
								alt={item.name}
								src={item.imgSrc}
							/>
						</>
					)}
				</a>

				{description && (
					<div className="mt-1 line-clamp-1 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
						<div dangerouslySetInnerHTML={{__html: marked(item.description)}} />
					</div>
				)}
			</div>
		</div>
	);
};
