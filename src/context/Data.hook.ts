import { useState } from "react";

import type { Data } from "./Data.context";

export default (): Data => {
	const [mapping, setMapping] = useState<[string, string][]>([]);
	const [headers, setHeaders] = useState<string[]>([]);
	const [rows, setRows] = useState<string[][]>([]);
	const [validRows, setValidRows] = useState<string[][]>([]);

	return {
		mapping,
		setMapping,
		headers,
		setHeaders,
		rows,
		setRows,
		validRows,
		setValidRows,
	};
};
