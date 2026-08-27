type RoutePrefixRedirect = {
	from: string;
	to: string;
	includeRoot?: boolean;
};

// Public routes changed by the documentation information-architecture work.
// Keep this mapping explicit so new pages do not acquire unrelated aliases.
const routePrefixRedirects: RoutePrefixRedirect[] = [
	{ from: "/features/analytics", to: "/features/administration/analytics" },
	{ from: "/features/evaluation", to: "/features/administration/evaluation" },
	{
		from: "/features/interface/webhooks",
		to: "/features/administration/webhooks",
	},
	{ from: "/features/auth", to: "/features/authentication-access/auth" },
	{
		from: "/features/access-security/auth",
		to: "/features/authentication-access/auth",
	},
	{ from: "/features/rbac", to: "/features/authentication-access/rbac" },
	{
		from: "/features/access-security/rbac",
		to: "/features/authentication-access/rbac",
	},
	{
		from: "/features/access-security/api-keys",
		to: "/features/authentication-access/api-keys",
	},
	{ from: "/features/audio", to: "/features/chat-conversations/audio" },
	{
		from: "/features/media-generation/audio",
		to: "/features/chat-conversations/audio",
	},
	{
		from: "/features/chat-features",
		to: "/features/chat-conversations/chat-features",
	},
	{
		from: "/features/data-controls",
		to: "/features/chat-conversations/data-controls",
	},
	{
		from: "/features/experimental/direct-connections",
		to: "/features/chat-conversations/direct-connections",
	},
	{
		from: "/features/image-generation-and-editing",
		to: "/features/chat-conversations/image-generation-and-editing",
	},
	{
		from: "/features/media-generation/image-generation-and-editing",
		to: "/features/chat-conversations/image-generation-and-editing",
	},
	{ from: "/features/rag", to: "/features/chat-conversations/rag" },
	{
		from: "/features/web-search",
		to: "/features/chat-conversations/web-search",
	},
	{ from: "/features/mcp", to: "/features/extensibility/mcp" },
	{
		from: "/features/open-terminal",
		to: "/features/extensibility/open-terminal",
	},
	{
		from: "/features/pipelines",
		to: "/features/extensibility/pipelines",
	},
	{ from: "/features/plugin", to: "/features/extensibility/plugin" },
	{ from: "/features/ai-knowledge", to: "/features/workspace" },
	{
		from: "/getting-started/quick-start/starting-with-llama-cpp",
		to: "/getting-started/quick-start/connect-a-provider/starting-with-llama-cpp",
	},
	{
		from: "/getting-started/quick-start/starting-with-ollama",
		to: "/getting-started/quick-start/connect-a-provider/starting-with-ollama",
	},
	{
		from: "/getting-started/quick-start/starting-with-vllm",
		to: "/getting-started/quick-start/connect-a-provider/starting-with-vllm",
	},
	{ from: "/tutorials/https", to: "/reference/https" },
	{ from: "/tutorials/tab-nginx", to: "/reference/tab-nginx" },
	{
		from: "/getting-started/advanced-topics/monitoring/otel",
		to: "/reference/monitoring/otel",
	},
	{
		from: "/getting-started/advanced-topics/network-diagrams",
		to: "/reference/network-diagrams",
	},
	{
		from: "/tutorials/integrations/custom-ca",
		to: "/troubleshooting/custom-ca",
	},
	{
		from: "/tutorials/integrations",
		to: "/tutorials/auth-sso",
		includeRoot: false,
	},
	{
		from: "/tutorials/integrations",
		to: "/tutorials/integrations/dev-tools",
		includeRoot: false,
	},
	{
		from: "/tutorials/integrations",
		to: "/tutorials/integrations/llm-providers",
		includeRoot: false,
	},
	{
		from: "/tutorials/integrations",
		to: "/tutorials/integrations/monitoring",
		includeRoot: false,
	},
	{
		from: "/tutorials/offline-mode",
		to: "/tutorials/maintenance/offline-mode",
	},
	{
		from: "/tutorials/tips/contributing-tutorial",
		to: "/tutorials/contributing-tutorial",
	},
	{
		from: "/features/extensibility/plugin/community",
		to: "/features/extensibility/community",
	},
	{
		from: "/features/knowledge-base-sync",
		to: "/ecosystem/knowledge-base-sync",
	},
	{
		from: "/ecosystem/computer/use-cases/agent-supervision",
		to: "/ecosystem/computer/use-cases/supervise-a-coding-agent",
	},
	{
		from: "/ecosystem/computer/use-cases/real-device-preview",
		to: "/ecosystem/computer/use-cases/test-on-a-real-device",
	},
	{
		from: "/ecosystem/computer/use-cases/remote-fix",
		to: "/ecosystem/computer/use-cases/fix-from-your-phone",
	},
];

const normalizeRoute = (route: string): string =>
	route === "/" ? route : route.replace(/\/+$/, "");

export const legacyRedirects = [
	{ from: "/features/computer", to: "/ecosystem/computer" },
	{ from: "/features/computer/features", to: "/ecosystem/computer" },
];

export function createLegacyRedirects(
	existingPath: string
): string[] | undefined {
	const path = normalizeRoute(existingPath);
	const legacyPaths = routePrefixRedirects
		.filter(
			({ to, includeRoot = true }) =>
				(path !== to || includeRoot) &&
				(path === to || path.startsWith(`${to}/`))
		)
		.map(({ from, to }) => `${from}${path.slice(to.length)}`);

	return legacyPaths.length > 0 ? legacyPaths : undefined;
}
