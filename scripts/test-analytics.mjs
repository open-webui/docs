import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Import the browser module without a DOM; initialization must remain SSR-safe.
const source = await readFile(
	new URL("../src/clientModules/analytics.js", import.meta.url),
	"utf8"
);
const analytics = await import(
	`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

assert.equal(analytics.isProductionHost("docs.openwebui.com"), true);
for (const host of [
	"localhost",
	"127.0.0.1",
	"openwebui.com",
	"preview.openwebui.com",
	"docs.openwebui.com.evil.test",
	"fork.github.io",
]) {
	assert.equal(analytics.isProductionHost(host), false, host);
}
assert.equal(analytics.analyticsConsent(), null);
assert.equal(
	analytics.docsPageProperties("/enterprise/customers/").page_group,
	"evaluation"
);
assert.equal(
	analytics.docsPageProperties("/getting-started/quick-start/").page_group,
	"setup"
);
assert.equal(
	analytics.docsPageProperties("/enterprise/security").page_group,
	"evaluation"
);
assert.equal(
	analytics.docsPageProperties("/enterprise/customers/noerr").page_group,
	"customer_story"
);
assert.equal(
	analytics.docsPageProperties("/ecosystem/computer/quickstart").product,
	"computer"
);
assert.equal(
	analytics.docsPageProperties("/troubleshooting/startup").page_group,
	"troubleshooting"
);

assert.deepEqual(
	analytics.docsLinkProperties(
		"https://openwebui.com/contact/sales?product=computer",
		"https://docs.openwebui.com/"
	),
	{
		destination_kind: "sales",
		destination_url: "https://openwebui.com/contact/sales",
		target_product: "computer",
	}
);
assert.equal(
	analytics.docsLinkProperties(
		"https://github.com/open-webui/desktop",
		"https://docs.openwebui.com/"
	).destination_kind,
	"desktop_download"
);
assert.equal(
	analytics.docsLinkProperties(
		"https://openwebui.com/models/private",
		"https://docs.openwebui.com/"
	),
	null
);
assert.equal(
	analytics.docsLinkProperties(
		"mailto:private@example.com",
		"https://docs.openwebui.com/"
	),
	null
);
assert.equal(
	analytics.docsLinkProperties(
		"javascript:alert(1)",
		"https://docs.openwebui.com/"
	),
	null
);

assert.deepEqual(
	analytics.filterAnalyticsProperties({
		$current_url: "https://docs.openwebui.com/search?q=secret#private",
		$referrer: "https://openwebui.com/models/private?token=secret",
		$pathname: "/search",
		$host: "docs.openwebui.com",
		command_mode: "docker",
		query: "secret",
		code: "secret",
		email: "private@example.com",
		$set: { email: "secret" },
	}),
	{
		$current_url: "https://docs.openwebui.com/search",
		$referrer: "https://openwebui.com",
		$pathname: "/search",
		$host: "docs.openwebui.com",
		command_mode: "docker",
	}
);

const code = {
	closest: () => ({ querySelector: () => ({ textContent: "Docker Compose" }) }),
};
assert.equal(
	analytics.setupMethod(code, "/getting-started/quick-start/"),
	"compose"
);
assert.equal(
	analytics.setupMethod(code, "/reference/env-configuration"),
	"unspecified"
);
assert.equal(
	analytics.setupMethod(code, "/ecosystem/computer/install/docker"),
	"docker"
);
console.log(
	"Analytics host restrictions, privacy filters, page classification and handoffs passed."
);
