import { searchDocs } from "./search.mjs";

const DEFAULT_CORPUS_URL = "https://docs.openwebui.com/search-corpus.json";
let cachedCorpus;

function json(data, init = {}) {
	return new Response(JSON.stringify(data, null, 2), {
		...init,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=60",
			...(init.headers ?? {}),
		},
	});
}

async function loadCorpus(env) {
	if (cachedCorpus) {
		return cachedCorpus;
	}

	const corpusUrl = env.SEARCH_CORPUS_URL || DEFAULT_CORPUS_URL;
	const response = await fetch(corpusUrl, {
		headers: { accept: "application/json" },
		cf: { cacheTtl: 300, cacheEverything: true },
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch search corpus: HTTP ${response.status}`);
	}

	cachedCorpus = await response.json();
	return cachedCorpus;
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"access-control-allow-origin": "*",
					"access-control-allow-methods": "GET, OPTIONS",
					"access-control-allow-headers": "content-type",
				},
			});
		}

		if (request.method !== "GET") {
			return json({ error: "Method not allowed" }, { status: 405 });
		}

		const query = (url.searchParams.get("q") || "").trim();
		const limit = Math.min(
			20,
			Math.max(1, Number.parseInt(url.searchParams.get("limit") || "8", 10))
		);

		if (!query) {
			return json(
				{
					error: "Missing query",
					example: "https://docs.openwebui.com/api/search?q=notion%20mcp",
				},
				{ status: 400 }
			);
		}

		if (query.length > 200) {
			return json({ error: "Query is too long" }, { status: 400 });
		}

		try {
			const corpus = await loadCorpus(env);
			const { keywords, results } = searchDocs(corpus, query, limit);
			return json({
				query,
				keywords,
				count: results.length,
				results,
			});
		} catch (error) {
			return json({ error: error.message }, { status: 502 });
		}
	},
};
