import type { JSX } from "react";

import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { generated } from "@/data/schema";

import { InputFile } from "./components/InputFile";

const App = (): JSX.Element => {
	// Bust app if doesn't exist
	console.log("schemas generated", generated);

	return (
		<ThemeProvider
			defaultTheme={"dark"}
			storageKey={"vite-ui-theme"}
		>
			<InputFile />
		</ThemeProvider>
	);
};

export default App;
