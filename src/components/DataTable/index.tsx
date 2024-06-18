import { Fragment, useContext, useRef, type JSX } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import DataContext from "@/context/Data.context";
import DatabaseSchema from "@/data/schema.json";
import { getForeignKeys } from "@/lib/data";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import Selects from "./Selects";

// To Do: Add loading
const TableSummary = (): JSX.Element => {
	const data = useContext(DataContext);
	const schemas = useRef(Object.keys(DatabaseSchema.properties) as (keyof typeof DatabaseSchema["properties"])[]);

	// Each handled similarly - no data will be assigned
	const defaultHeaders = ["auto_generated", "not_set", "foreign_key"];

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

	const check = (checked: boolean, checkValue: string, header: string): void => {
		const headerIndex = data.mapping.findIndex((el) => el[0] === header);

		if (headerIndex >= -1) {
			const newMapping = [...data.mapping];
			const index = newMapping.findIndex((val) => {
				return val[2].includes(checkValue);
			});

			if (index > -1 && !checked) {
				newMapping[headerIndex][2].splice(index, 1);
			} else if (checked) {
				newMapping[headerIndex][2].push(checkValue);
			}

			data.setMapping(newMapping);
		}
	};

	const renderOptions = (header: string): JSX.Element => {
		const disabled = !data.mapping.some((el) => el[0] === header);
		return (
			<div className={"flex gap-2 flex-col"}>
				<div className={"flex items-center space-x-2"}>
					<Checkbox
						id={"nullable"}
						disabled={disabled}
						onCheckedChange={(checked) => {
							check(checked as boolean, "nullable", header);
						}}
					/>

					<label
						htmlFor={"nullable"}
						className={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
					>
						Nullable
					</label>
				</div>

				<div className={"flex items-center space-x-2"}>
					<Checkbox
						id={"deduplicate"}
						disabled={disabled}
						onCheckedChange={(checked) => {
							check(checked as boolean, "deduplicate", header);
						}}
					/>

					<label
						htmlFor={"deduplicate"}
						className={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
					>
						Deduplicate
					</label>
				</div>
			</div>
		);
	};

	const renderForeignKeyRelation = (tableName: string, header: string): JSX.Element | JSX.Element[] => {
		const foreignKeys = getForeignKeys(tableName, data.activeSchema);

		if (!foreignKeys.foreignKeys.includes(header)) {
			return (
				<Fragment />
			);
		}

		const keyIndex = foreignKeys.foreignKeys.findIndex((val) => val === header);

		return (
			<div
				className={"flex flex-col"}
			>
				<p>Relation: {foreignKeys.relations[keyIndex]}</p>

				<p>Column: {foreignKeys.columns[keyIndex]}</p>

				<p>CSV column select</p>

				<p>Relation column select</p>

				<Select
					onValueChange={(newVal) => {
						console.log(newVal);
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder={"Select from CSV"} />
					</SelectTrigger>

					{renderSelectItems()}
				</Select>
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

								{renderOptions(header)}

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
