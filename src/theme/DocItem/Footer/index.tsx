import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import DocItemFooter from "@theme-original/DocItem/Footer";
import DocsFeedback from "@site/src/components/DocsFeedback";

export default function DocItemFooterWrapper(props) {
	const licenseLink = (
		<Link to="/license">
			<Translate id="theme.DocItem.disclaimer.license">license</Translate>
		</Link>
	);

	return (
		<>
			<DocsFeedback />
			<div className="disclaimer-bar">
				<Translate
					id="theme.DocItem.disclaimer"
					description="The disclaimer shown below documentation pages"
					values={{ licenseLink }}
				>
					{
						'This content is for informational purposes only and does not constitute a warranty, guarantee, or contractual commitment. Open WebUI is provided "as is." See your {licenseLink} for applicable terms.'
					}
				</Translate>
			</div>
			<DocItemFooter {...props} />
		</>
	);
}
