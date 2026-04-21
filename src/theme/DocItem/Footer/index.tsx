import React from "react";
import DocItemFooter from "@theme-original/DocItem/Footer";

const DISCLAIMER_TEXT =
	'This content is for informational purposes only and does not constitute a warranty, guarantee, or contractual commitment. Open WebUI is provided "as is." See your ';

export default function DocItemFooterWrapper(props) {
	return (
		<>
			<div className="disclaimer-bar">
				{DISCLAIMER_TEXT}
				<a href="/license">license</a> for applicable terms.
			</div>
			<DocItemFooter {...props} />
		</>
	);
}
