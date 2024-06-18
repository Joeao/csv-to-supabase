import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

import type DatabaseSchema from "@/data/schema.json";
import type DataRow from "@/interface/DataRow";

export interface Data {
	mapping: [string, string, string[]][];
	setMapping: Dispatch<SetStateAction<[string, string, string[]][]>>;
	headers: string[];
	setHeaders: Dispatch<SetStateAction<string[]>>;
	rows: DataRow[];
	setRows: Dispatch<SetStateAction<DataRow[]>>;
	validRows: DataRow[];
	setValidRows: Dispatch<SetStateAction<DataRow[]>>;
	activeSchema: keyof typeof DatabaseSchema["properties"];
	setActiveSchema: Dispatch<SetStateAction<keyof typeof DatabaseSchema["properties"]>>;
	activeTable: string;
	setActiveTable: Dispatch<SetStateAction<string>>;
}

export default createContext<Data>({} as Data);
