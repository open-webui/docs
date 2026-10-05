import fs from "node:fs";
import path from "node:path";

// An index page is reachable both as /dir and /dir/, so a relative link on it
// resolves to a different page depending on which URL the reader arrived at.
const docsDir = "docs";
const relativeLink = /\]\((\.\.?\/[^)\s]*)\)/g;
const fileLink = /\.mdx?(#|$)/;

const indexPages = fs
	.readdirSync(docsDir, { recursive: true })
	.filter((file) => /(^|[\\/])index\.mdx?$/.test(file))
	.map((file) => path.join(docsDir, file));

const offenders = [];
for (const page of indexPages) {
	const lines = fs.readFileSync(page, "utf8").split("\n");
	lines.forEach((line, index) => {
		for (const [, target] of line.matchAll(relativeLink)) {
			if (!fileLink.test(target)) {
				offenders.push(`${page}:${index + 1}: ${target}`);
			}
		}
	});
}

if (offenders.length) {
	console.error(
		"Relative links on index pages break when the page is opened without a trailing slash.\n" +
			"Use an absolute path (/features/...) or link the file itself (./page.md):\n"
	);
	console.error(offenders.join("\n"));
	process.exit(1);
}

console.log(`Index page links OK (${indexPages.length} pages checked).`);
