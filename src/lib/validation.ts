import type { Data } from "@/context/Data.context";
import type DataRow from "@/interface/DataRow";

export const validateData = (data: Data["rows"], mapping: Data["mapping"]): DataRow[] => {
	const cleanData: DataRow[] = [];
	const stringifiedRows: string[] = [];

	for (let i = 0; i < data.length; i++) {
		const row = data[i];

		for (let j = 0; j < mapping.length; j++) {
			// If key exists in row
			if (mapping[j][1] in row) {
				let canPush = true;

				// If nullable not allowed
				if (!mapping[j][2].includes("nullable")) {
					// Check if null, undefined or empty
					if (row[mapping[j][1]] === null || row[mapping[j][1]] === undefined || row[mapping[j][1]] === "") {
						canPush = false;
					}
				}

				if (canPush) {
					const stringifiedRow = String(row[mapping[j][1]]);

					if (mapping[j][2].includes("deduplicate")) {
						const rowInCleanData = stringifiedRows.find((r) => r === stringifiedRow);

						if (!rowInCleanData) {
							cleanData.push(row);
							stringifiedRows.push(stringifiedRow);
						}
					} else {
						cleanData.push(row);
						stringifiedRows.push(stringifiedRow);
					}
				}
			}
		}
	}

	return cleanData;
};
