export const Sponsor = ({ sponsor }) => {
	return (
		<>
			<div className="mb-2 flex flex-col">
				<div className="mb-1.5 text-[0.6rem] font-semibold text-gray-500 dark:text-gray-400">
					<a href={sponsor.url} target="_blank" className="no-underline">
						{sponsor.name}
					</a>
				</div>

				<a href={sponsor.url} target="_blank" className="no-underline">
					<div className="flex w-32 items-start gap-2.5 md:w-48">
						<div className="basis-1/2">
							<img
								className="rounded-xl"
								loading="lazy"
								alt={sponsor.name}
								src={sponsor.imgSrc}
							/>
						</div>

						<div className="flex basis-1/2">
							<div className="line-clamp-4 text-[0.6rem] font-semibold text-gray-500 no-underline dark:text-gray-400 md:line-clamp-5">
								{sponsor.description}
							</div>
						</div>
					</div>
				</a>
			</div>
		</>
	);
};
