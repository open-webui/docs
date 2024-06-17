export const Sponsor = ({ sponsor }) => {
	return (
		<>
			<div className="flex flex-col mb-2 ">
				<div className="text-[0.6rem] text-gray-500 dark:text-gray-400 font-bold underline mb-1.5">
					<a href={sponsor.url} target="_blank">
						{sponsor.name}
					</a>
				</div>

				<a href={sponsor.url} target="_blank">
					<div className="flex w-32 md:w-48 gap-2.5 items-start">
						<div className=" basis-1/2">
							<img
								className="rounded-xl "
								loading="lazy"
								alt={sponsor.name}
								src={sponsor.imgSrc}
							/>
						</div>

						<div className=" basis-1/2 flex">
							<div className=" text-[0.6rem] text-gray-500 dark:text-gray-400 font-bold  line-clamp-4 md:line-clamp-5 no-underline">
								{sponsor.description}
							</div>
						</div>
					</div>
				</a>
			</div>
		</>
	);
};
