import React, { type ReactNode } from "react";
import type { Props } from "@theme/Icon/Menu";

export default function IconMenu({
	width = 24,
	height = 24,
	className,
	...restProps
}: Props): ReactNode {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 24 24"
			aria-hidden="true"
			fill="none"
			{...restProps}
		>
			<path
				d="M6.5 8H17.5M6.5 12H17.5M6.5 16H17.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.35"
				opacity="0.42"
			/>
		</svg>
	);
}
