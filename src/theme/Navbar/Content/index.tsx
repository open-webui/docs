import React from "react";
import Content from "@theme-original/Navbar/Content";
import type ContentType from "@theme/Navbar/Content";
import type { WrapperProps } from "@docusaurus/types";
import { TopBanners } from "@site/src/components/TopBanners";

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
	return (
		<>
			<div className="h-full items-center w-full flex ">
				<div className="flex w-full flex-col">
					<div>
						<Content {...props} />
					</div>

					<div className="mt-3 min-[996px]:hidden">
						<TopBanners bannerClassName={"h-10"} label={false} mobile={false} />
					</div>
				</div>
			</div>
		</>
	);
}
