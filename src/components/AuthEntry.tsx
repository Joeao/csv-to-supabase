import type { JSX } from "react";
import { Outlet } from "react-router-dom";

function App(): JSX.Element {
	return (
		<Outlet />
	);
}

export default App;
