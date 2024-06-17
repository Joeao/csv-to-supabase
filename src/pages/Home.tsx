import { Terminal } from "lucide-react";
import { Fragment, type JSX } from "react";

import { InputFile } from "@/components/InputFile";
import TableSummary from "@/components/TableSummary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DatabaseSchema from "@/data/schema.json";

const Home = (): JSX.Element => {
	const renderContent = (): JSX.Element => {
		if (!DatabaseSchema?.properties) {
			console.log("no data");
			return (
				<Alert>
					<Terminal className={"h-4 w-4"} />

					<AlertTitle>Heads up!</AlertTitle>

					<AlertDescription>
						You need to generate schemas first
					</AlertDescription>
				</Alert>
			);
		}

		return (
			<Fragment>
				<TableSummary />

				<InputFile />
			</Fragment>
		);
	};

	return renderContent();
};

export default Home;
