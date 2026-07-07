import fs from "node:fs";
import path from "node:path";

const BUILD_DIR = "build";
const CORPUS_PATH = path.join(BUILD_DIR, "search-corpus.json");
const LLMS_PATH = path.join(BUILD_DIR, "llms.txt");
const LLMS_FULL_PATH = path.join(BUILD_DIR, "llms-full.txt");

function normalizeWhitespace(text) {
	return text.replace(/\s+/g, " ").trim();
}

function truncate(text, maxLength) {
	if (text.length <= maxLength) {
		return text;
	}

	return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function cleanMarkdownInline(text) {
	return normalizeWhitespace(
		text
			.replace(/!\[[^\]]*]\([^)]+\)/g, "")
			.replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
			.replace(/[*_`]/g, "")
	);
}

function descriptionFor(content) {
	const lines = content
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.filter((line) => !line.startsWith("#"))
		.filter((line) => !line.startsWith("Source:"))
		.filter((line) => !line.startsWith(":::"))
		.filter((line) => !line.startsWith("import "));

	const firstUsefulLine = lines.find((line) => !line.startsWith("|")) || "";
	return truncate(normalizeWhitespace(firstUsefulLine), 180);
}

if (!fs.existsSync(CORPUS_PATH)) {
	throw new Error("Run `npm run build` before generating llms files.");
}

const { docs } = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf8"));

const generatedAt = new Date().toISOString();
const llmsLines = [
	"# Open WebUI Docs",
	"",
	"Machine-readable entry points to this documentation:",
	"",
	"- /llms.txt - curated index of every docs page with short descriptions.",
	"- /llms-full.txt - every docs page concatenated into a single Markdown file.",
	"- /sitemap.xml - canonical HTML page discovery.",
	"- /api/search?q=YOUR_QUERY - deterministic docs search.",
	"",
	"For any docs page, append `.md` for Markdown or `.txt` for plain text.",
	"When citing sources, cite canonical HTML URLs, not `.md`, `.txt`, search API, sitemap, agents.txt, or llms.txt URLs.",
	"",
	`Generated: ${generatedAt}`,
	"",
	"## Pages",
	"",
];

for (const doc of docs) {
	llmsLines.push(
		`- [${cleanMarkdownInline(doc.title)}](${doc.url}): ${descriptionFor(doc.content)}`
	);
}

fs.writeFileSync(LLMS_PATH, `${llmsLines.join("\n")}\n`);

const fullLines = [
	"# Open WebUI Docs Full Corpus",
	"",
	"Every docs page concatenated into a single Markdown file.",
	"When citing sources, cite canonical HTML URLs.",
	"",
	`Generated: ${generatedAt}`,
	"",
];

for (const doc of docs) {
	fullLines.push("---", "", doc.content.trim(), "");
}

fs.writeFileSync(LLMS_FULL_PATH, `${fullLines.join("\n")}\n`);

console.log(`Generated llms.txt and llms-full.txt for ${docs.length} docs pages.`);
