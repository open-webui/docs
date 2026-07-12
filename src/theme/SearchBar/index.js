// Wraps the search plugin's SearchBar. Exact-phrase results (src/client/exactSearch.js)
// navigate with ?_highlight_phrase=<phrase>; this marks that phrase on the target page
// as one unit and scrolls to it, instead of the plugin's per-word _highlight marking.
import React, { useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import Mark from "mark.js";
import OriginalSearchBar from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar";

function escapeRegExp(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function SearchBar(props) {
	const location = useLocation();
	useEffect(() => {
		const raw = new URLSearchParams(location.search).get("_highlight_phrase");
		// The /search page appends its own query string after ours; keep our part.
		const phrase = raw ? raw.split("?")[0].trim() : "";
		if (!phrase) {
			return undefined;
		}
		// After the plugin's own mark effect (setTimeout 0) so its unmark() runs first.
		const timer = setTimeout(() => {
			const root = document.querySelector("article");
			if (!root) {
				return;
			}
			const pattern = new RegExp(
				phrase.split(/\s+/).map(escapeRegExp).join("[\\s\\u00A0]+"),
				"i"
			);
			new Mark(root).markRegExp(pattern, {
				acrossElements: true,
				done: () => {
					root.querySelector("mark")?.scrollIntoView({ block: "center" });
				},
			});
		}, 150);
		return () => clearTimeout(timer);
	}, [location.search, location.pathname]);
	return <OriginalSearchBar {...props} />;
}
