import { Fragment, useContext, useRef, type JSX } from "react";

import DataContext from "@/context/Data.context";
import DatabaseSchema from "@/data/schema.json";
import { getForeignKeys } from "@/lib/data";

import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import Options from "./Options";
import SelectItems from "./SelectItems/CsvData";
import Generic from "./SelectItems/Generic";
import Selects from "./Selects";

const TableSummary = (): JSX.Element => {
	const data = useContext(DataContext);
	const schemas = useRef(Object.keys(DatabaseSchema.properties) as (keyof typeof DatabaseSchema["properties"])[]);

	const renderTabs = (): JSX.Element[] => {
		const tables = DatabaseSchema.properties[data.activeSchema].properties.Tables;
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

	const renderForeignKeyRelation = (tableName: string, header: string): JSX.Element | JSX.Element[] => {
		const foreignKeys = getForeignKeys(tableName, data.activeSchema);

		if (!foreignKeys.foreignKeys.includes(header)) {
			return (
				<Fragment />
			);
		}

		const keyIndex = foreignKeys.foreignKeys.findIndex((val) => val === header);

		const tables = (DatabaseSchema.properties[data.activeSchema]).properties.Tables;

		return (
			<div
				className={"flex flex-col gap-2"}
			>
				<p>{`Get "${foreignKeys.columns[keyIndex]}" where following match`}</p>

				<div className={"flex gap-2 align-center"}>
					<Select
						onValueChange={(newVal) => {
						console.log(newVal);
					}}
					>
						<SelectTrigger>
							<SelectValue placeholder={"Select from CSV"} />
						</SelectTrigger>

						<SelectItems defaultHeaders={false} />
					</Select>

					<p>{"=>"}</p>

					<Select
						onValueChange={(newVal) => {
						console.log(newVal);
					}}
					>
						<SelectTrigger>
							<SelectValue placeholder={`Select from ${foreignKeys.relations[keyIndex]}`} />
						</SelectTrigger>

						<Generic
							items={
								Object.keys(
									tables.properties[
										foreignKeys.relations[keyIndex] as keyof typeof tables.properties
									].properties.Row.properties
								)
							}
						/>
					</Select>
				</div>
			</div>
		);
	};

	const renderContentlessBody = (val: string): JSX.Element => {
		if (!data.headers?.length) {
			return (
				<Fragment />
			);
		}

		// To Do: If mapping saved, return fragment
		const tables = (DatabaseSchema.properties[data.activeSchema]).properties.Tables;
		const foreignKeys = getForeignKeys(val, data.activeSchema).foreignKeys;

		return (
			<TableBody>
				<TableRow>
					{Object.keys(tables.properties[val as keyof typeof tables.properties].properties.Row.properties).map((header) => (
						<TableCell
							key={header}
							className={"middle"}
						>
							<div className={"flex flex-col justify-start gap-2"}>
								<Selects
									header={header}
									foreignKeys={foreignKeys}
								/>

								<Options header={header} />

								{renderForeignKeyRelation(val, header)}
							</div>
						</TableCell>
					))}
				</TableRow>
			</TableBody>
		);
	};

	const renderContentBody = (): JSX.Element => {
		// To Do: If no mapping saved, return fragment

		// Return data

		return <Fragment />;
	};

	const renderTabsContent = (): JSX.Element[] => {
		const tables = (DatabaseSchema.properties[data.activeSchema]).properties.Tables;
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

					{renderContentlessBody(val)}

					{renderContentBody()}
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
					<Tabs
						defaultValue={Object.keys(DatabaseSchema.properties[schemaName].properties.Tables.properties)[0]}
						onValueChange={(tabName) => {
							data.setMapping([]);
							data.setActiveTable(tabName);
						}}
					>
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
			className={"w-[1440px]"}
			onValueChange={(val) => {
				data.setActiveSchema(val as keyof typeof DatabaseSchema["properties"]);
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
