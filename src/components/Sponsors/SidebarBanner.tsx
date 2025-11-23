import {marked} from 'marked';

export const SidebarBanner = ({ item }) => {
	return (
		<div className="pb-4">
			<div className="mb-2">
				<div className="mb-1 text-xs font-medium text-gray-600 underline dark:text-gray-300">
					Sponsored by {item.name}
				</div>

				<a href={item.url} target="_blank">
					<img
						className="block h-12 w-full rounded-xl object-cover"
						loading="lazy"
						alt={item.name}
						src={item?.mobileImgSrc || item.imgSrc}
					/>
				</a>

				<div className="mt-1 line-clamp-2 text-right text-xs font-medium text-gray-600 dark:text-gray-300">
					<div dangerouslySetInnerHTML={{__html: marked(item.description)}} />
				</div>
			</div>
		</div>
	);
};
