import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const DOCS_DIR = "docs";
const BUILD_DIR = "build";
const SITE_URL = "https://docs.openwebui.com";

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	return entries.flatMap((entry) => {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			return walk(fullPath);
		}
		return [fullPath];
	});
}

function isDocPage(filePath) {
	if (!/\.(md|mdx)$/.test(filePath)) {
		return false;
	}
	if (filePath.includes(`${path.sep}tab-`)) {
		return false;
	}
	if (path.basename(filePath).startsWith("_template.")) {
		return false;
	}
	return true;
}

function parseFrontMatter(source) {
	if (!source.startsWith("---\n")) {
		return { frontMatter: {}, body: source };
	}

	const end = source.indexOf("\n---", 4);
	if (end === -1) {
		return { frontMatter: {}, body: source };
	}

	const raw = source.slice(4, end).trim();
	const body = source.slice(end + 4).replace(/^\s*\n/, "");
	const frontMatter = {};

	for (const line of raw.split("\n")) {
		const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (match) {
			frontMatter[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
		}
	}

	return { frontMatter, body };
}

function routeForDoc(filePath) {
	const source = fs.readFileSync(filePath, "utf8");
	const { frontMatter } = parseFrontMatter(source);

	if (frontMatter.slug) {
		return normalizeRoute(frontMatter.slug);
	}

	let route = filePath
		.replace(
			new RegExp(
				`^${(DOCS_DIR + path.sep).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
			),
			""
		)
		.replace(/\.(md|mdx)$/, "")
		.split(path.sep)
		.join("/");

	if (route.endsWith("/index")) {
		route = route.slice(0, -"/index".length);
	}

	return normalizeRoute(`/${route}`);
}

function normalizeRoute(route) {
	if (!route || route === "/") {
		return "/";
	}
	return `/${route.replace(/^\/+|\/+$/g, "")}`;
}

function routeToHtmlPath(route) {
	if (route === "/") {
		return path.join(BUILD_DIR, "index.html");
	}
	return path.join(BUILD_DIR, route.slice(1), "index.html");
}

function routeToRawPath(route, extension) {
	if (route === "/") {
		return path.join(BUILD_DIR, `index.${extension}`);
	}
	return path.join(BUILD_DIR, `${route.slice(1)}.${extension}`);
}

function routeToRawHref(route, extension) {
	if (route === "/") {
		return `/index.${extension}`;
	}
	return `${route}.${extension}`;
}

function htmlUrl(route) {
	return `${SITE_URL}${route === "/" ? "/" : route}`;
}

function textOf($, node) {
	return $(node).text().replace(/\s+/g, " ").trim();
}

function tableToMarkdown($, table) {
	const rows = [];
	$(table)
		.find("tr")
		.each((_, tr) => {
			const cells = $(tr)
				.children("th,td")
				.map((__, cell) => textOf($, cell).replace(/\|/g, "\\|"))
				.get();
			if (cells.length) {
				rows.push(cells);
			}
		});

	if (!rows.length) {
		return "";
	}

	const width = Math.max(...rows.map((row) => row.length));
	const normalized = rows.map((row) => [
		...row,
		...Array.from({ length: width - row.length }, () => ""),
	]);
	const header = normalized[0];
	const separator = Array.from({ length: width }, () => "---");
	const body = normalized.slice(1);

	return [header, separator, ...body]
		.map((row) => `| ${row.join(" | ")} |`)
		.join("\n");
}

function convertChildren($, node) {
	return $(node)
		.contents()
		.map((_, child) => convertNode($, child))
		.get()
		.join("");
}

function convertNode($, node) {
	if (node.type === "text") {
		return node.data.replace(/\s+/g, " ");
	}

	if (node.type !== "tag") {
		return "";
	}

	const tag = node.name.toLowerCase();
	const className = $(node).attr("class") ?? "";
	const role = $(node).attr("role") ?? "";
	const inner = convertChildren($, node).trim();

	if (className.includes("hash-link") || role === "tablist") {
		return "";
	}
	if (tag === "ul" && className.split(/\s+/).includes("tabs")) {
		return "";
	}
	if (className.includes("theme-admonition")) {
		const title = $(node).find(".admonitionHeading_Gvgb").first().text().trim();
		const content = $(node).find(".admonitionContent_BuS1").first();
		const body = content.length ? convertChildren($, content).trim() : inner;
		return `\n\n> **${title}**\n>\n${body
			.split("\n")
			.map((line) => `> ${line}`)
			.join("\n")}\n\n`;
	}

	if (/^h[1-6]$/.test(tag)) {
		return `\n\n${"#".repeat(Number(tag[1]))} ${inner}\n\n`;
	}
	if (tag === "p") {
		return `\n\n${inner}\n\n`;
	}
	if (tag === "br") {
		return "\n";
	}
	if (tag === "strong" || tag === "b") {
		return `**${inner}**`;
	}
	if (tag === "em" || tag === "i") {
		return `_${inner}_`;
	}
	if (tag === "code") {
		if ($(node).parents("pre").length) {
			return $(node).text();
		}
		return `\`${$(node).text().replace(/`/g, "\\`")}\``;
	}
	if (tag === "pre") {
		const code = $(node).text().replace(/\n+$/, "");
		const language =
			$(node)
				.find("code")
				.attr("class")
				?.match(/language-([^\s]+)/)?.[1] ?? "";
		return `\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
	}
	if (tag === "a") {
		const href = $(node).attr("href");
		return href ? `[${inner || href}](${href})` : inner;
	}
	if (tag === "img") {
		const src = $(node).attr("src");
		const alt = $(node).attr("alt") ?? "";
		return src ? `![${alt}](${src})` : "";
	}
	if (tag === "ul" || tag === "ol") {
		return `\n${$(node)
			.children("li")
			.map((index, li) => {
				const marker = tag === "ol" ? `${index + 1}.` : "-";
				return `${marker} ${convertChildren($, li).trim()}`;
			})
			.get()
			.join("\n")}\n\n`;
	}
	if (tag === "blockquote") {
		return `\n\n${inner
			.split("\n")
			.map((line) => `> ${line}`)
			.join("\n")}\n\n`;
	}
	if (tag === "table") {
		return `\n\n${tableToMarkdown($, node)}\n\n`;
	}
	if (tag === "hr") {
		return "\n\n---\n\n";
	}
	if (tag === "svg" || tag === "button") {
		return "";
	}
	if (tag === "div") {
		return inner ? `\n\n${inner}\n\n` : "";
	}

	return inner;
}

function compactMarkdown(markdown) {
	return markdown
		.replace(/[ \t]+\n/g, "\n")
		.replace(/^[ \t]+(?=```)/gm, "")
		.replace(/^[ \t]+(?=#{1,6} )/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.replace(/^\s+|\s+$/g, "")
		.concat("\n");
}

function markdownFromHtml(htmlPath, route) {
	const $ = cheerio.load(fs.readFileSync(htmlPath, "utf8"));
	const content = $(".theme-doc-markdown.markdown").first();

	if (!content.length) {
		return "";
	}

	const markdown = compactMarkdown(convertChildren($, content));
	return markdown.replace(/^(# .+\n)/, `$1\nSource: ${htmlUrl(route)}\n`);
}

function injectAlternateLinks(htmlPath, route) {
	const html = fs.readFileSync(htmlPath, "utf8");
	const mdHref = routeToRawHref(route, "md");
	const txtHref = routeToRawHref(route, "txt");
	const links = [
		`<link rel="alternate" type="text/markdown" href="${mdHref}">`,
		`<link rel="alternate" type="text/plain" href="${txtHref}">`,
	].join("");

	if (html.includes(`href="${mdHref}"`) && html.includes(`href="${txtHref}"`)) {
		return;
	}

	fs.writeFileSync(htmlPath, html.replace("</head>", `${links}</head>`));
}

function writeRawFiles(route, markdown) {
	for (const extension of ["md", "txt"]) {
		const outputPath = routeToRawPath(route, extension);
		fs.mkdirSync(path.dirname(outputPath), { recursive: true });
		fs.writeFileSync(outputPath, markdown);
	}
}

if (!fs.existsSync(BUILD_DIR)) {
	throw new Error("Run `npm run build` before generating raw docs.");
}

let count = 0;
const routes = new Set();

for (const filePath of walk(DOCS_DIR).filter(isDocPage)) {
	const route = routeForDoc(filePath);
	if (routes.has(route)) {
		continue;
	}
	routes.add(route);

	const htmlPath = routeToHtmlPath(route);
	if (!fs.existsSync(htmlPath)) {
		continue;
	}

	const markdown = markdownFromHtml(htmlPath, route);
	if (!markdown) {
		continue;
	}

	writeRawFiles(route, markdown);
	injectAlternateLinks(htmlPath, route);
	count += 1;
}

console.log(`Generated raw Markdown/Text for ${count} docs pages.`);
