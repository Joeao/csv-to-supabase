import { Terminal } from "lucide-react";
import { Fragment, type JSX } from "react";
import { toast } from "sonner";

import TableSummary from "@/components/DataTable";
import { InputFile } from "@/components/InputFile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import DataContext from "@/context/Data.context";
import useData from "@/context/Data.hook";
import DatabaseSchema from "@/data/schema.json";
import client from "@/lib/supabase";
import { formatData, validateData } from "@/lib/validation";

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
					const validatedData = validateData(data.rows, data.mapping);
					const formattedData = formatData(validatedData, data.mapping);

					if (data.activeTable && validatedData.length) {
						console.log(data.activeTable, formattedData);
						client().schema(data.activeSchema).from(
							// eslint-disable-line @typescript-eslint/no-explicit-any
							data.activeTable as any // Much easier to assign any as long as schema is dynamically set
						).insert(formattedData)
						.then((val) => {
							console.log(val);

							if (val.status < 300 && val.status >= 200) {
								toast(`${formattedData.length} rows inserted!`);
							}
						});
					}
				}}
			>
				Upload Data
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
