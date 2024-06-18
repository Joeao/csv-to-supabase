import { Terminal } from "lucide-react";
import { Fragment, type JSX } from "react";

import TableSummary from "@/components/DataTable";
import { InputFile } from "@/components/InputFile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import DataContext from "@/context/Data.context";
import useData from "@/context/Data.hook";
import DatabaseSchema from "@/data/schema.json";
import client from "@/lib/supabase";
import { validateData } from "@/lib/validation";

const Home = (): JSX.Element => {
	const data = useData();

	const renderSaveMapping = (): JSX.Element => {
		if (!data.mapping?.length) {
			return <Fragment />;
		}

		return (
			<Button
				variant={"default"}
				onClick={() => {
					// To Do:
					//	Validate data
					// 	Clone valid data
					// 	Highlight invalid data

					const validatedData = validateData(data.rows, data.mapping);

					if (data.activeTable && validatedData.length) {
						console.log(data.activeTable, validatedData);
						// client().from(data.activeTable).insert(data.rows);
					}

					//
				}}
			>
				Preview Data
			</Button>
		);
	};

	const renderContent = (): JSX.Element => {
		if (!DatabaseSchema?.properties) {
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
			<DataContext.Provider value={data}>
				<Fragment>
					<TableSummary />

					<InputFile
						action={(fileData) => {
							console.log(fileData);
							data.setHeaders(Object.keys(fileData[0]));

							data.setRows(fileData);
						}}
					/>

					{renderSaveMapping()}
				</Fragment>
			</DataContext.Provider>
		);
	};

	return renderContent();
};

export default Home;
