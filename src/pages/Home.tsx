import { Fragment, type JSX } from "react";

import { InputFile } from "@/components/InputFile";
import TableSummary from "@/components/TableSummary";

const Home = (): JSX.Element => {
	return (
		<Fragment>
			<TableSummary />

			<InputFile />
		</Fragment>
	);
};

export default Home;
