if (
	process.env.NODE_ENV !== "production" &&
	typeof window !== "undefined" &&
	typeof window.gtag !== "function"
) {
	window.gtag = () => {};
}
