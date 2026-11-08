// Same production project as openwebui.com; the token is public, not a personal API key.
const projectToken = "phc_zfVxBoWmQXBzHJQVqQnNiJXrU9s3mQsX5jaNw4NL4S4t";
const consentCookie = "owui_analytics_consent";
let posthog;
let loading;

export function isProductionHost(hostname) {
	return hostname === "docs.openwebui.com";
}

export function analyticsConsent() {
	if (typeof document === "undefined") return null;
	return (
		document.cookie.match(
			/(?:^|; )owui_analytics_consent=(accepted|rejected)(?:;|$)/
		)?.[1] || null
	);
}

export function setAnalyticsConsent(choice) {
	if (!["accepted", "rejected"].includes(choice)) return;
	const domain = /(^|\.)openwebui\.com$/.test(location.hostname)
		? "; Domain=openwebui.com"
		: "";
	document.cookie = `${consentCookie}=${choice}; Path=/; Max-Age=15552000; SameSite=Lax${domain}${location.protocol === "https:" ? "; Secure" : ""}`;
	void syncAnalytics();
}

export function docsPageProperties(pathname) {
	const path = pathname.replace(/\/$/, "") || "/";
	const computer = path.startsWith("/ecosystem/computer");
	return {
		surface: "docs",
		product: computer ? "computer" : "open_webui",
		doc_section: computer ? "computer" : path.split("/")[1] || "home",
		page_group: path.startsWith("/enterprise/customers/")
			? "customer_story"
			: path.startsWith("/getting-started") ||
				  /^\/ecosystem\/computer\/(quickstart|install)(\/|$)/.test(path)
				? "setup"
				: path.startsWith("/enterprise") ||
					  path === "/license" ||
					  path.startsWith("/alternatives")
					? "evaluation"
					: path.includes("/troubleshooting")
						? "troubleshooting"
						: "documentation",
	};
}

export function cleanAnalyticsUrl(value) {
	try {
		const url = new URL(value);
		if (!["http:", "https:"].includes(url.protocol)) return "";
		// Only retain public marketing paths on the community host.
		if (
			url.hostname === "openwebui.com" &&
			!/^\/(?:computer|sovereign-ai|government|defense|finance|healthcare|education|legal|wizards|contact\/sales|blog(?:\/[^/]+)?|customers(?:\/[^/]+)?)?\/?$/.test(
				url.pathname
			)
		)
			return url.origin;
		return url.origin + url.pathname;
	} catch {
		return "";
	}
}

const allowedProperties = new Set(
	`token distinct_id $device_id $session_id $window_id $pageview_id $lib $lib_version
$browser $browser_version $os $os_version $device_type $screen_height $screen_width $viewport_height $viewport_width
$current_url $pathname $host $referrer $referring_domain $process_person_profile
$session_entry_url $session_entry_pathname $session_entry_referrer $session_entry_referring_domain
$session_entry_utm_source $session_entry_utm_medium $session_entry_utm_campaign $session_entry_utm_content
$prev_pageview_id $prev_pageview_pathname $prev_pageview_duration $prev_pageview_max_scroll_percentage
command_mode link_location destination_kind destination_url target_product`.split(
		/\s+/
	)
);

export function filterAnalyticsProperties(properties) {
	return Object.fromEntries(
		Object.entries(properties)
			.filter(([key]) => allowedProperties.has(key))
			.map(([key, value]) => [
				key,
				/(?:url|referrer)$/.test(key) ? cleanAnalyticsUrl(value) : value,
			])
	);
}

const methods = {
	Docker: "docker",
	"Docker Compose": "compose",
	Extension: "extension",
	Podman: "podman",
	Quadlets: "podman_quadlet",
	"Kube Play": "podman_kube_play",
	Swarm: "swarm",
	WSL: "wsl",
	Python: "python",
	pip: "pip",
	uv: "uv",
	Conda: "conda",
	Venv: "venv",
	Kubernetes: "kubernetes",
	Helm: "helm",
	Desktop: "desktop",
	"Third Party": "third_party",
};

export function setupMethod(element, pathname = location.pathname) {
	if (pathname.replace(/\/$/, "") === "/getting-started/quick-start") {
		const tab = element
			.closest(".tabs-container")
			?.querySelector(':scope > [role="tablist"] > [aria-selected="true"]');
		return methods[tab?.textContent?.trim()] || "unspecified";
	}
	if (/^\/ecosystem\/computer\/(quickstart|install)(\/|$)/.test(pathname)) {
		return pathname.includes("/docker")
			? "docker"
			: pathname.includes("/windows")
				? "windows"
				: "python";
	}
	return "unspecified";
}

export function captureCodeCopy(element) {
	capture("docs_code_copied", {
		command_mode: setupMethod(element),
		link_location: "code_block",
	});
}

export function docsLinkProperties(href, currentUrl) {
	let url;
	try {
		url = new URL(href, currentUrl);
	} catch {
		return null;
	}
	if (url.protocol === "mailto:")
		return url.pathname.toLowerCase() === "sales@openwebui.com"
			? { destination_kind: "sales_email" }
			: null;
	if (!["https:", "http:"].includes(url.protocol)) return null;
	const path = url.pathname.replace(/\/$/, "");
	let kind;
	if (url.hostname === "openwebui.com" && path === "/contact/sales")
		kind = "sales";
	else if (url.hostname === "openwebui.com" && path === "/computer/license")
		kind = "checkout";
	else if (
		url.hostname === "github.com" &&
		/^\/open-webui\/desktop(?:\/releases(?:\/.*)?)?$/.test(path)
	)
		kind = "desktop_download";
	else if (url.hostname === "github.com" && path === "/sponsors/open-webui")
		kind = "sponsor";
	else if (url.hostname === "github.com" && path.startsWith("/open-webui/"))
		kind = "github";
	else return null;
	return {
		destination_kind: kind,
		destination_url: url.origin + url.pathname,
		target_product:
			url.searchParams.get("product") === "computer" ||
			path.includes("/computer")
				? "computer"
				: "open_webui",
	};
}

function capture(event, properties) {
	if (!isProductionHost(location.hostname) || analyticsConsent() !== "accepted")
		return;
	posthog?.capture(event, properties, {
		transport: "sendBeacon",
		send_instantly: true,
	});
}

export async function syncAnalytics() {
	if (!isProductionHost(location.hostname)) return;
	if (analyticsConsent() !== "accepted") {
		posthog?.opt_out_capturing();
		return;
	}
	if (process.env.NODE_ENV !== "production") return;
	if (!posthog) {
		loading ??= import("posthog-js")
			.then(({ default: sdk }) => {
				if (analyticsConsent() !== "accepted") return;
				sdk.init(projectToken, {
					api_host: "https://us.i.posthog.com",
					persistence: "localStorage+cookie",
					cross_subdomain_cookie: true,
					cookieWinsOnConflict: true,
					opt_out_capturing_persistence_type: "cookie",
					person_profiles: "never",
					capture_pageview: "history_change",
					capture_pageleave: true,
					autocapture: false,
					capture_dead_clicks: false,
					capture_performance: false,
					capture_exceptions: false,
					disable_session_recording: true,
					disable_surveys: true,
					advanced_disable_flags: true,
					disable_external_dependency_loading: true,
					ip: false,
					before_send: (event) => {
						if (
							!event ||
							!isProductionHost(location.hostname) ||
							analyticsConsent() !== "accepted"
						)
							return null;
						delete event.$set;
						delete event.$set_once;
						event.properties = {
							...filterAnalyticsProperties(event.properties),
							...docsPageProperties(
								event.properties.$pathname || location.pathname
							),
						};
						return event;
					},
				});
				posthog = sdk;
			})
			.catch(() => {
				/* Analytics must not interrupt documentation. */
			})
			.finally(() => {
				loading = undefined;
			});
		await loading;
	}
	if (analyticsConsent() === "accepted" && posthog?.has_opted_out_capturing()) {
		posthog.opt_in_capturing({ captureEventName: false });
		posthog.capture("$pageview");
	}
}

if (typeof window !== "undefined") {
	const trackClick = (event) => {
		if (event.type === "auxclick" && event.button !== 1) return;
		if (
			!(event.target instanceof Element) ||
			event.target.closest("[data-no-analytics]")
		)
			return;
		const link = event.target.closest("a[href]");
		const properties =
			event.type !== "keyup" &&
			link &&
			docsLinkProperties(link.href, location.href);
		if (properties)
			capture("marketing_link_clicked", {
				...properties,
				link_location:
					link.closest("header, nav, footer, article")?.tagName.toLowerCase() ||
					"content",
			});
		const tab = event.target.closest('[role="tab"]');
		if (
			(event.type === "click" ||
				(event.type === "keyup" &&
					["Enter", "ArrowLeft", "ArrowRight"].includes(event.key))) &&
			tab &&
			location.pathname.replace(/\/$/, "") === "/getting-started/quick-start"
		) {
			const method = methods[tab.textContent.trim()];
			if (method)
				capture("docs_install_method_selected", { command_mode: method });
		}
	};
	document.addEventListener("click", trackClick);
	document.addEventListener("auxclick", trackClick);
	document.addEventListener("keyup", trackClick);
	window.addEventListener("focus", () => {
		void syncAnalytics();
	});
	window.addEventListener("pageshow", () => {
		void syncAnalytics();
	});
}

// The SDK handles pageviews. This hook only rechecks consent after navigation.
export function onRouteDidUpdate() {
	void syncAnalytics();
}
