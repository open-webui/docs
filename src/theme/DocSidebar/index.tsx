import React from "react";
import DocSidebar from "@theme-original/DocSidebar";
import type DocSidebarType from "@theme/DocSidebar";
import type { WrapperProps } from "@docusaurus/types";

import { SidebarBanners } from "@site/src/components/SidebarBanners";

type Props = WrapperProps<typeof DocSidebarType>;

export default function DocSidebarWrapper(props: Props): JSX.Element {
	return (
		<>
			<div className="flex h-full flex-col overflow-auto">
				<div className="h-fit">
					<DocSidebar {...props} />
				</div>

				<div className="mt-3 px-5">
					<SidebarBanners />
				</div>
			</div>
		</>
	);
}
