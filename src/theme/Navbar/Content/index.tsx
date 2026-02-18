import React from "react";
import Content from "@theme-original/Navbar/Content";
import type ContentType from "@theme/Navbar/Content";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
	return (
		<>
			<div className="flex h-full w-full items-center">
				<div className="flex w-full flex-col">
					<div>
						<Content {...props} />
					</div>
				</div>
			</div>
		</>
	);
}
