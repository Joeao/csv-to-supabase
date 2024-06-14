import type { JSX } from "react";

import "./App.css";
import { InputFile } from "@/components/InputFile";
import { ThemeProvider } from "@/components/theme-provider";

const App = (): JSX.Element => {
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
