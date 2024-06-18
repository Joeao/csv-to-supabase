import { useState } from "react";

import DatabaseSchema from "@/data/schema.json";
import type DataRow from "@/interface/DataRow";

import type { Data } from "./Data.context";

export default (): Data => {
	const initialSchema = Object.keys(DatabaseSchema.properties)?.[0] as (keyof typeof DatabaseSchema["properties"]);
	const [mapping, setMapping] = useState<[string, string, string[]][]>([]);
	const [headers, setHeaders] = useState<string[]>([]);
	const [rows, setRows] = useState<DataRow[]>([]);
	const [validRows, setValidRows] = useState<DataRow[]>([]);
	const [activeSchema, setActiveSchema] = useState(initialSchema);
	const [activeTable, setActiveTable] = useState(Object.keys(DatabaseSchema.properties[initialSchema].properties.Tables.properties)[0]);

	return {
		mapping,
		setMapping,
		headers,
		setHeaders,
		rows,
		setRows,
		validRows,
		setValidRows,
		activeSchema,
		setActiveSchema,
		activeTable,
		setActiveTable,
	};
};
