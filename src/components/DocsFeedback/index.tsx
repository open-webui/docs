import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import styles from "./styles.module.css";

export default function DocsFeedback() {
	const { metadata } = useDoc();
	const { siteConfig } = useDocusaurusContext();
	const params = new URLSearchParams({
		template: "docs-feedback.yml",
		title: `[Docs feedback]: ${metadata.title}`,
		"page-title": metadata.title,
		"page-url": new URL(metadata.permalink, siteConfig.url).href,
	});

	return (
		<aside className={styles.card} aria-label="Improve this page">
			<strong>Improve this page</strong>
			<p>Missing a step? Something unclear or outdated?</p>
			<a href={`https://github.com/open-webui/docs/issues/new?${params}`}>
				Share feedback <span aria-hidden="true">↗</span>
			</a>
		</aside>
	);
}
