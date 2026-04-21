import React from "react";
import DocItemFooter from "@theme-original/DocItem/Footer";

export default function DocItemFooterWrapper(props) {
	return (
		<>
			<div className="disclaimer-bar">
				This content is for informational purposes only and does not constitute a
				warranty, guarantee, or contractual commitment. Open WebUI is provided "as
				is." See your{" "}
				<a href="/license">license</a> for applicable terms.
			</div>
			<DocItemFooter {...props} />
		</>
	);
}
