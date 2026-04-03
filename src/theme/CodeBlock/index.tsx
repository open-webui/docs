/**
 * Swizzled CodeBlock — preserves a copy button when children have already been
 * transformed into React elements by @shikijs/rehype.
 *
 * String children → stock StringContent (Prism path, full Docusaurus UI).
 * Element children (Shiki) → lightweight wrapper with a standalone copy button.
 */
import React, { isValidElement, useState, useCallback, type ReactNode } from "react";
import type { Props } from "@theme/CodeBlock";
import useIsBrowser from "@docusaurus/useIsBrowser";
import StringContent from "@theme/CodeBlock/Content/String";
import clsx from "clsx";

/** Recursively extract every text-node from a React tree. */
function extractText(node: ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (!node) return "";
	if (Array.isArray(node)) return node.map(extractText).join("");
	if (isValidElement(node)) {
		return extractText((node.props as { children?: ReactNode }).children);
	}
	return "";
}

function CopyButton({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	}, [code]);

	return (
		<button
			type="button"
			aria-label={copied ? "Copied" : "Copy code to clipboard"}
			title="Copy"
			className={clsx("clean-btn", "shiki-copy-button")}
			onClick={handleCopy}
		>
			{copied ? (
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
					<polyline points="20 6 9 17 4 12" />
				</svg>
			) : (
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			)}
		</button>
	);
}

export default function CodeBlock({
	children: rawChildren,
	...props
}: Props): React.JSX.Element {
	const isBrowser = useIsBrowser();

	// Plain-string children → stock Prism/StringContent path
	if (typeof rawChildren === "string") {
		return (
			<StringContent key={String(isBrowser)} {...props}>
				{rawChildren}
			</StringContent>
		);
	}

	// Element children (Shiki output)
	const code = extractText(rawChildren);

	return (
		<div className="theme-code-block shiki-code-block" key={String(isBrowser)}>
			<div className="shiki-code-block-content">
				<pre tabIndex={0} className="thin-scrollbar">
					<code>{rawChildren}</code>
				</pre>
				{isBrowser && <CopyButton code={code} />}
			</div>
		</div>
	);
}
