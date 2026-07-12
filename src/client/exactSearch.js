// Drop-in replacement for @easyops-cn/docusaurus-search-local's theme/searchByWorker
// (wired via NormalModuleReplacementPlugin in docusaurus.config.ts).
// Adds an exact-substring layer over search-corpus.json: when a multi-word or
// quoted query occurs verbatim in a page, those hits rank first; token-based
// results from the original worker follow.
import * as Comlink from "comlink";
import Slugger from "github-slugger";

let remoteWorkerPromise;
function getRemoteWorker() {
	if (process.env.NODE_ENV === "production" && !remoteWorkerPromise) {
		remoteWorkerPromise = (async () => {
			const Remote = Comlink.wrap(
				new Worker(
					new URL(
						"../../node_modules/@easyops-cn/docusaurus-search-local/dist/client/client/theme/worker.js",
						import.meta.url
					)
				)
			);
			return await new Remote();
		})();
	}
	return remoteWorkerPromise;
}

export async function fetchIndexesByWorker(baseUrl, searchContext) {
	if (process.env.NODE_ENV === "production") {
		const remoteWorker = await getRemoteWorker();
		await remoteWorker.fetchIndexes(baseUrl, searchContext);
	}
}

let corpusPromise;
function fetchCorpus(baseUrl) {
	if (!corpusPromise) {
		corpusPromise = fetch(`${baseUrl}search-corpus.json`)
			.then((res) => (res.ok ? res.json() : { docs: [] }))
			.then((json) => (json.docs || []).map(prepareDoc))
			.catch(() => []);
	}
	return corpusPromise;
}

export function prepareDoc(doc) {
	// Strip link targets and emphasis markers (outside code fences) so matching
	// approximates rendered text; keep fence lines so the heading scan can skip blocks.
	// Collapse spaces/tabs but keep newlines (text and matchable stay offset-aligned).
	let inFence = false;
	const lines = (doc.content || "")
		.replace(/\r\n?/g, "\n")
		.split("\n")
		.map((line) => {
			if (/^ {0,3}(```|~~~)/.test(line)) {
				inFence = !inFence;
				return line;
			}
			if (inFence) {
				return line;
			}
			return line.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*`]/g, "");
		});
	const text = lines.join("\n").replace(/[^\S\n]+/g, " ");
	return {
		title: doc.title || "Untitled",
		path: doc.path || "/",
		text,
		matchable: text.replace(/\n/g, " ").toLowerCase(),
	};
}

export function normalizeQuery(input) {
	let query = input.trim();
	const quoted = query.length > 2 && query.startsWith('"') && query.endsWith('"');
	if (quoted) {
		query = query.slice(1, -1);
	}
	query = query.replace(/\s+/g, " ").trim();
	return { query, eligible: query.length >= 3 && (quoted || /\s/.test(query)) };
}

function nearestHeadingAnchor(text, matchIndex) {
	const slugger = new Slugger();
	const lineRegex = /^ {0,3}(?:(```|~~~)[^\r\n]*|(#{1,6}) +(.+?) *)$/gm;
	let inFence = false;
	let anchor;
	let heading;
	let match;
	while ((match = lineRegex.exec(text)) !== null) {
		if (match[1]) {
			inFence = !inFence;
			continue;
		}
		if (inFence) {
			continue;
		}
		if (match.index > matchIndex) {
			break;
		}
		const explicit = match[3].match(/^(.*?) *\{#([^}]+)\} *$/);
		heading = (explicit ? explicit[1] : match[3]).trim();
		anchor = explicit ? explicit[2] : slugger.slug(heading);
	}
	return anchor ? { anchor: `#${anchor}`, heading } : {};
}

function makeSnippet(text, index, length) {
	let start = Math.max(0, index - 40);
	let end = Math.min(text.length, index + length + 90);
	if (start > 0) {
		const ws = text.indexOf(" ", start);
		if (ws !== -1 && ws < index) start = ws + 1;
	}
	if (end < text.length) {
		const ws = text.lastIndexOf(" ", end);
		if (ws > index + length) end = ws;
	}
	const prefix = start > 0 ? "… " : "";
	const suffix = end < text.length ? " …" : "";
	const body = text.slice(start, end).replace(/\n/g, " ");
	return { snippet: prefix + body + suffix, matchStart: prefix.length + (index - start) };
}

export function searchExact(docs, query, limit) {
	const q = query.toLowerCase();
	const hits = [];
	for (const doc of docs) {
		const firstIndex = doc.matchable.indexOf(q);
		if (firstIndex === -1) {
			continue;
		}
		let count = 0;
		for (let i = firstIndex; i !== -1 && count < 50; i = doc.matchable.indexOf(q, i + q.length)) {
			count += 1;
		}
		const titleHit = doc.title.toLowerCase().includes(q);
		hits.push({ doc, firstIndex, score: count + (titleHit ? 100 : 0) });
	}
	hits.sort((a, b) => b.score - a.score || a.doc.path.length - b.doc.path.length);

	return hits.slice(0, limit).map(({ doc, firstIndex }) => {
		const { anchor, heading } = nearestHeadingAnchor(doc.text, firstIndex);
		const { snippet, matchStart } = makeSnippet(doc.text, firstIndex, q.length);
		// Empty tokens: the dropdown then marks the whole matched range as one
		// <mark>, and the plugin skips its per-word _highlight params. The phrase
		// travels in our own param, marked on the target page by the SearchBar wrapper.
		return {
			document: {
				i: `exact:${doc.path}`,
				t: snippet,
				s: heading || doc.title,
				u: `${doc.path}?_highlight_phrase=${encodeURIComponent(query)}`,
				h: anchor,
				b: [],
			},
			type: 4, // SearchDocumentType.Content
			page: { i: `exact-page:${doc.path}`, t: doc.title, u: doc.path, b: [] },
			metadata: { [q]: { t: { position: [[matchStart, q.length]] } } },
			tokens: [],
			score: 0,
		};
	});
}

export async function searchByWorker(baseUrl, searchContext, input, limit) {
	if (process.env.NODE_ENV !== "production") {
		return [];
	}
	const { query, eligible } = normalizeQuery(input);
	const tokenPromise = getRemoteWorker().then((worker) =>
		worker.search(baseUrl, searchContext, input, limit)
	);
	if (!eligible) {
		return tokenPromise;
	}
	const [exact, tokenResults] = await Promise.all([
		fetchCorpus(baseUrl).then((docs) => searchExact(docs, query, limit)),
		tokenPromise,
	]);
	if (!exact.length) {
		return tokenResults;
	}
	const routeKey = (r) => r.document.u.split("?")[0] + (r.document.h || "");
	const seen = new Set(exact.map(routeKey));
	return exact.concat(tokenResults.filter((r) => !seen.has(routeKey(r)))).slice(0, limit);
}
