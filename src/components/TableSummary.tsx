import { Fragment, useContext, useRef, useState, type JSX } from "react";

import DataContext from "@/context/Data.context";
import type { Database } from "@/data/schema";
import DatabaseSchema from "@/data/schema.json";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TableSummary = (): JSX.Element => {
	const data = useContext(DataContext);
	const schemas = useRef(Object.keys(DatabaseSchema.properties) as (keyof Database)[]);
	const [schema, setSchema] = useState<keyof Database>(schemas.current[0]);

	const defaultHeaders = ["auto_generated", "not_set"];

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

	const renderSelects = (val: string): JSX.Element => {
		const defaultVal = data.headers.includes(val) ? val : "not_set";
		return (
			<Select defaultValue={defaultVal}>
				<SelectTrigger>
					<SelectValue placeholder={defaultVal} />
				</SelectTrigger>

				{renderSelectItems()}
			</Select>
		);
	};

	const renderSelectItems = (): JSX.Element => {
		return (
			<SelectContent>
				{[...defaultHeaders, ...data.headers].flatMap((val) => {
					if (!val?.length) {
						return [];
					}

					return (
						<SelectItem
							value={val}
							key={val}
						>
							{val}
						</SelectItem>
					);
				})}
			</SelectContent>
		);
	};

	const renderBody = (val: string): JSX.Element => {
		if (!data.headers?.length) {
			return (
				<Fragment />
			);
		}

		const tables = (DatabaseSchema.properties[schema]).properties.Tables;

		return (
			<TableBody>
				<TableRow>
					{Object.keys(tables.properties[val as keyof typeof tables.properties].properties.Row.properties).map((header) => (
						<TableCell key={header}>{renderSelects(val)}</TableCell>
					))}
				</TableRow>
			</TableBody>
		);
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

					{renderBody(val)}
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
