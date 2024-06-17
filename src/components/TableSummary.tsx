import { useRef, useState, type JSX } from "react";

import type { Database } from "@/data/schema";
import DatabaseSchema from "@/data/schema.json";

import { Table, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TableSummary = (): JSX.Element => {
	const schemas = useRef(Object.keys(DatabaseSchema.properties));
	const [schema, setSchema] = useState(schemas.current[0]);
	
	const renderTabs = (): JSX.Element[] => {
		const tables = DatabaseSchema.properties[schema].properties.Tables;
		const tablesNames = Object.keys(tables.properties);

		return tablesNames.map((val) => (
			<TabsTrigger
				value={val}
			>
				{val}
			</TabsTrigger>		
		))
	};

	const renderTabsContent = (): JSX.Element[] => {
		const tables = DatabaseSchema.properties[schema].properties.Tables;
		const tablesNames = Object.keys(tables.properties);

		return tablesNames.map((val) => (
			<TabsContent
				value={val}
			>
				<Table>
					<TableHeader>
						<TableRow>
							{Object.keys(tables.properties[val].properties.Row.properties).map((val) => (
								<TableHead>{val}</TableHead>
							))}
						</TableRow>
					</TableHeader>
				</Table>
			</TabsContent>	
		))
	};

	const renderSchemaNames = (): JSX.Element[] => {
		return schemas.current.map((schema) => (
			<TabsTrigger
				key={schema}
				value={schema}
			>
				{schema}
			</TabsTrigger>
		));
	};

	const renderContent = (): JSX.Element[] => {
		return schemas.current.map((schema) => {
			return (
				<TabsContent
					key={schema}
					value={schema}
				>
					<Tabs defaultValue={Object.keys(DatabaseSchema.properties[schema].properties.Tables.properties)[0]}>
					<TabsList>
						{renderTabs()}
					</TabsList>
					{renderTabsContent()}
					</Tabs>
				</TabsContent>
			);
		});
	};


	return (
		<Tabs
			defaultValue={schemas.current[0]}
			className={"w-[1200px]"}
			onValueChange={(val) => {
				setSchema(val);
			}}
		>
			<TabsList>
				{renderSchemaNames()}
			</TabsList>

			{renderContent()}
		</Tabs>
	);
};

export default TableSummary;
