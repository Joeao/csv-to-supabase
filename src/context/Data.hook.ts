import { useState } from "react";

import type { Data } from "./Data.context";

export default (): Data => {
	const [mapping, setMapping] = useState<[string, string][]>([]);
	const [headers, setHeaders] = useState<string[]>([]);

	return {
		mapping,
		setMapping,
		headers,
		setHeaders,
	};
};
