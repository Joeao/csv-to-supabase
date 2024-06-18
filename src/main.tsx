import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import Router from "./Router";

import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider
			defaultTheme={"dark"}
			storageKey={"vite-ui-theme"}
		>
			<Router />
		</ThemeProvider>
	</React.StrictMode>
);
