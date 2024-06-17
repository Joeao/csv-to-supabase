import { useRef, useState, type JSX } from "react";

import type { Database } from "@/data/schema";
import DatabaseSchema from "@/data/schema.json";

import { Table, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TableSummary = (): JSX.Element => {
	const schemas = useRef(Object.keys(DatabaseSchema.properties) as (keyof Database)[]);
	const [schema, setSchema] = useState<keyof Database>(schemas.current[0]);

	const renderTabs = (): JSX.Element[] => {
		const tables = DatabaseSchema.properties[schema].properties.Tables;
		const tablesNames = Object.keys(tables.properties);

		return tablesNames.map((val) => (
			<TabsTrigger
				key={val}
				value={val}
			>
				{val}
			</TabsTrigger>
		));
	};

	const renderTabsContent = (): JSX.Element[] => {
		const tables = (DatabaseSchema.properties[schema]).properties.Tables;
		const tablesNames = Object.keys(tables.properties);

		return tablesNames.map((val) => (
			<TabsContent
				key={val}
				value={val}
			>
				<Table>
					<TableHeader>
						<TableRow>
							{Object.keys(tables.properties[val as keyof typeof tables.properties].properties.Row.properties).map((header) => (
								<TableHead key={header}>{header}</TableHead>
							))}
						</TableRow>
					</TableHeader>
				</Table>
			</TabsContent>
		));
	};

	const renderSchemaNames = (): JSX.Element[] => {
		return schemas.current.map((schemaName) => (
			<TabsTrigger
				key={schemaName}
				value={schemaName}
			>
				{schemaName}
			</TabsTrigger>
		));
	};

	const renderContent = (): JSX.Element[] => {
		return schemas.current.map((schemaName) => {
			return (
				<TabsContent
					key={schemaName}
					value={schemaName}
				>
					<Tabs defaultValue={Object.keys(DatabaseSchema.properties[schemaName].properties.Tables.properties)[0]}>
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
				setSchema(val as keyof Database);
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
