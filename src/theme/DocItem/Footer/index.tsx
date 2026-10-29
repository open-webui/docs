import React from "react";
import DocItemFooter from "@theme-original/DocItem/Footer";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import DocsFeedback from "@site/src/components/DocsFeedback";
import feedbackStyles from "@site/src/components/DocsFeedback/styles.module.css";

const DISCLAIMER_TEXT =
	'This content is for informational purposes only and does not constitute a warranty, guarantee, or contractual commitment. Open WebUI is provided "as is." See your ';

export default function DocItemFooterWrapper(props) {
	const { frontMatter, toc } = useDoc();
	const hasSidebar = !frontMatter.hide_table_of_contents && toc.length > 0;

	return (
		<>
			<div
				className={
					hasSidebar ? feedbackStyles["footer-with-sidebar"] : undefined
				}
			>
				<DocsFeedback />
			</div>
			<div className="disclaimer-bar">
				{DISCLAIMER_TEXT}
				<a href="/license">license</a> for applicable terms.
			</div>
			<DocItemFooter {...props} />
		</>
	);
}
