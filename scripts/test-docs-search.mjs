import fs from "node:fs";
import { searchDocs } from "../workers/docs-search/src/search.mjs";

const corpus = JSON.parse(fs.readFileSync("build/search-corpus.json", "utf8"));

const cases = [
	["notion mcp", "mcp-notion"],
	["sso keycloak", "sso"],
	["rebrand logo", "brand"],
	["mcp timeout", "mcp"],
];

for (const [query, expectedPathPart] of cases) {
	const { results } = searchDocs(corpus, query, 8);
	if (!results.length) {
		throw new Error(`No results for ${query}`);
	}
	if (!results.some((result) => result.path.includes(expectedPathPart))) {
		throw new Error(
			`Expected ${query} to match ${expectedPathPart}; got ${results
				.map((result) => result.path)
				.join(", ")}`
		);
	}
}

console.log("Docs search smoke tests passed.");
