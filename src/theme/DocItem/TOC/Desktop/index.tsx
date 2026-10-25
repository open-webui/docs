import React from "react";
import DocItemTOCDesktop from "@theme-original/DocItem/TOC/Desktop";
import DocsFeedback from "@site/src/components/DocsFeedback";

import styles from "./styles.module.css";

export default function DocItemTOCDesktopWrapper() {
	return (
		<div className={`${styles.sidebar} thin-scrollbar`}>
			<DocItemTOCDesktop />
			<DocsFeedback />
		</div>
	);
}
