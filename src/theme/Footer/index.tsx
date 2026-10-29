import React, { useEffect, useState } from "react";
import Footer from "@theme-original/Footer";
import {
	analyticsConsent,
	setAnalyticsConsent,
} from "../../clientModules/analytics";
import styles from "./styles.module.css";

export default function FooterWrapper(props) {
	const [showConsent, setShowConsent] = useState(false);
	useEffect(() => {
		const refresh = () => setShowConsent(!analyticsConsent());
		refresh();
		window.addEventListener("focus", refresh);
		return () => window.removeEventListener("focus", refresh);
	}, []);
	const choose = (choice: string) => {
		setAnalyticsConsent(choice);
		setShowConsent(false);
	};
	return (
		<>
			<Footer {...props} />
			<div className={styles.settings} data-no-analytics>
				<button type="button" onClick={() => setShowConsent(true)}>
					Analytics preferences
				</button>
			</div>
			{showConsent && (
				<aside
					className={styles.notice}
					aria-label="Analytics preferences"
					data-no-analytics
				>
					<p>
						Allow optional analytics to help us improve our websites?{" "}
						<a href="https://openwebui.com/privacy">Privacy policy</a>
					</p>
					<div>
						<button type="button" onClick={() => choose("accepted")}>
							Accept
						</button>
						<button type="button" onClick={() => choose("rejected")}>
							Reject
						</button>
					</div>
				</aside>
			)}
		</>
	);
}
