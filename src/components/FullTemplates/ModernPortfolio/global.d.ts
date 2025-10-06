// Allow custom elements like <spline-viewer> in JSX
import React from "react";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"spline-viewer": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & {
				url?: string;
				style?: React.CSSProperties;
			};
		}
	}
}
