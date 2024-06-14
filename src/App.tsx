import type { JSX } from "react";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider"

import { InputFile } from "@/components/InputFile";

const App = (): JSX.Element => {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<InputFile />
		</ThemeProvider>
	);
};

export default App;
