import React, { useEffect, useState } from "react";
import Translate, { translate } from "@docusaurus/Translate";
import Footer from "@theme-original/Footer";
import {
	analyticsConsent,
	setAnalyticsConsent,
} from "../../clientModules/analytics";
import styles from "./styles.module.css";

export default function FooterWrapper(props) {
	const [showConsent, setShowConsent] = useState(false);
	const analyticsPreferencesLabel = translate({
		id: "theme.footer.analyticsPreferences",
		message: "Analytics preferences",
		description: "The analytics preferences button and dialog label",
	});
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
					{analyticsPreferencesLabel}
				</button>
			</div>
			{showConsent && (
				<aside
					className={styles.notice}
					aria-label={analyticsPreferencesLabel}
					data-no-analytics
				>
					<p>
						<Translate id="theme.footer.analyticsQuestion">
							Allow optional analytics to help us improve our websites?
						</Translate>{" "}
						<a href="https://openwebui.com/privacy">
							<Translate id="theme.footer.privacyPolicy">
								Privacy policy
							</Translate>
						</a>
					</p>
					<div>
						<button type="button" onClick={() => choose("accepted")}>
							<Translate id="theme.footer.acceptAnalytics">Accept</Translate>
						</button>
						<button type="button" onClick={() => choose("rejected")}>
							<Translate id="theme.footer.rejectAnalytics">Reject</Translate>
						</button>
					</div>
				</aside>
			)}
		</>
	);
}
