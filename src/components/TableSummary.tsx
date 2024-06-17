import { useEffect, useState, type JSX } from "react";

import type { Database } from "@/data/schema";
import DatabaseSchema from "@/data/schema.json";

import { Table, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TableSummary = (): JSX.Element => {
	const [schemas] = useState(Object.keys(DatabaseSchema.properties));

	const getTable = (): JSX.Element => {
		const headers = Object.keys(DatabaseSchema.properties[schemas[0]].properties.Tables.properties[schemas[0]].properties);

		console.log(headers);
		return (
			<Table>
				<TableHeader>
					<TableRow>

					</TableRow>
				</TableHeader>
			</Table>
		);
	};

	const renderSchemaNames = (): JSX.Element[] => {
		return schemas.map((schema) => (
			<TabsTrigger
				key={schema}
				value={schema}
			>
				{schema}
			</TabsTrigger>
		));
	};

	const renderContent = (): JSX.Element[] => {
		return schemas.map((schema) => {
			const tableNames = Object.keys(DatabaseSchema.properties[schema].properties.Tables.properties);

			return (
				<TabsContent
					key={schema}
					value={schema}
				>
					{tableNames}
				</TabsContent>
			);
		});
	};

	useEffect(() => {
		getTable();
	}, []);

	return (
		<Tabs
			defaultValue={schemas[0]}
			className={"w-[400px]"}
		>
			<TabsList>
				{renderSchemaNames()}
			</TabsList>

			{renderContent()}
		</Tabs>
	);
};

export default TableSummary;
