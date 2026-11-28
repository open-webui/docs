import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate, { translate } from "@docusaurus/Translate";

import styles from "./styles.module.css";

export default function DocsFeedback() {
	const { metadata } = useDoc();
	const { siteConfig } = useDocusaurusContext();
	const improvePageLabel = translate({
		id: "docs.feedback.improvePage",
		message: "Improve this page",
		description: "The title and ARIA label of the documentation feedback card",
	});
	const params = new URLSearchParams({
		template: "docs-feedback.yml",
		title: `[Docs feedback]: ${metadata.title}`,
		"page-title": metadata.title,
		"page-url": new URL(metadata.permalink, siteConfig.url).href,
	});

	return (
		<aside className={styles.card} aria-label={improvePageLabel}>
			<strong>{improvePageLabel}</strong>
			<p>
				<Translate
					id="docs.feedback.description"
					description="The prompt asking for documentation feedback"
				>
					Missing a step? Something unclear or outdated?
				</Translate>
			</p>
			<a href={`https://github.com/open-webui/docs/issues/new?${params}`}>
				<Translate
					id="docs.feedback.shareFeedback"
					description="The documentation feedback link label"
				>
					Share feedback
				</Translate>{" "}
				<span aria-hidden="true">↗</span>
			</a>
		</aside>
	);
}
