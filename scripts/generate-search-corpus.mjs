import fs from "node:fs";
import path from "node:path";

const BUILD_DIR = "build";
const SITE_URL = "https://docs.openwebui.com";
const OUTPUT_PATH = path.join(BUILD_DIR, "search-corpus.json");

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(fullPath) : [fullPath];
	});
}

function isRawDoc(filePath) {
	if (!filePath.endsWith(".md")) {
		return false;
	}
	return !filePath.endsWith("README.md");
}

function routeFromFile(filePath) {
	const relative = path.relative(BUILD_DIR, filePath).split(path.sep).join("/");
	if (relative === "index.md") {
		return "/";
	}
	return `/${relative.replace(/\.md$/, "")}`;
}

function titleFromMarkdown(markdown) {
	return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || "Untitled";
}

function markdownUrl(route) {
	return route === `${SITE_URL}/` ? `${SITE_URL}/index.md` : `${route}.md`;
}

function textUrl(route) {
	return route === `${SITE_URL}/` ? `${SITE_URL}/index.txt` : `${route}.txt`;
}

if (!fs.existsSync(BUILD_DIR)) {
	throw new Error("Run `npm run build` before generating the search corpus.");
}

const docs = walk(BUILD_DIR)
	.filter(isRawDoc)
	.map((filePath) => {
		const content = fs.readFileSync(filePath, "utf8");
		const route = routeFromFile(filePath);
		const url = `${SITE_URL}${route === "/" ? "/" : route}`;

		return {
			title: titleFromMarkdown(content),
			path: route,
			url,
			markdown_url: markdownUrl(url),
			text_url: textUrl(url),
			content,
		};
	})
	.sort((a, b) => a.path.localeCompare(b.path));

fs.writeFileSync(
	OUTPUT_PATH,
	`${JSON.stringify({ generated_at: new Date().toISOString(), docs })}\n`
);
console.log(`Generated search corpus for ${docs.length} docs pages.`);
