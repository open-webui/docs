export function keywordsFor(query) {
	return Array.from(
		new Set(
			query
				.toLowerCase()
				.split(/[^a-z0-9._/-]+/)
				.map((keyword) => keyword.trim())
				.filter(Boolean)
		)
	);
}

function distinctHits(text, keywords) {
	const lower = text.toLowerCase();
	return keywords.filter((keyword) => lower.includes(keyword));
}

function rankMatches(matches) {
	return matches.sort((a, b) => {
		if (b.score !== a.score) {
			return b.score - a.score;
		}
		return a.path.length - b.path.length;
	});
}

function makeSnippet(content, keywords) {
	const lower = content.toLowerCase();
	const index = keywords.reduce((best, keyword) => {
		const found = lower.indexOf(keyword);
		if (found === -1) {
			return best;
		}
		return best === -1 ? found : Math.min(best, found);
	}, -1);

	if (index === -1) {
		return content.slice(0, 240).replace(/\s+/g, " ").trim();
	}

	const start = Math.max(0, index - 120);
	const end = Math.min(content.length, index + 240);
	const prefix = start > 0 ? "..." : "";
	const suffix = end < content.length ? "..." : "";
	return `${prefix}${content.slice(start, end).replace(/\s+/g, " ").trim()}${suffix}`;
}

function toResult(doc, keywords, hits, match) {
	return {
		title: doc.title,
		path: doc.path,
		url: doc.url,
		markdown_url: doc.markdown_url,
		text_url: doc.text_url,
		match,
		score: hits.length,
		matched_keywords: hits,
		snippet: makeSnippet(doc.content, hits.length ? hits : keywords),
	};
}

export function searchDocs(corpus, query, limit = 8) {
	const keywords = keywordsFor(query);
	if (!keywords.length) {
		return { keywords, results: [] };
	}

	const docs = Array.isArray(corpus?.docs) ? corpus.docs : [];
	const pathMatches = [];
	const contentMatches = [];

	for (const doc of docs) {
		const pathHits = distinctHits(doc.path, keywords);
		if (pathHits.length) {
			pathMatches.push(toResult(doc, keywords, pathHits, "path"));
		}

		const contentHits = distinctHits(doc.content, keywords);
		if (contentHits.length) {
			contentMatches.push(toResult(doc, keywords, contentHits, "content"));
		}
	}

	const seen = new Set();
	const results = [];
	for (const result of [
		...rankMatches(pathMatches),
		...rankMatches(contentMatches),
	]) {
		if (seen.has(result.path)) {
			continue;
		}
		seen.add(result.path);
		results.push(result);
		if (results.length >= limit) {
			break;
		}
	}

	return { keywords, results };
}
