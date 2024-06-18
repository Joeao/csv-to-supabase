import type { Data } from "@/context/Data.context";
import type DataRow from "@/interface/DataRow";

export const validateData = (data: Data["rows"], mapping: Data["mapping"]): DataRow[] => {
	const cleanData: DataRow[] = [];

	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		let canPush = true;

		for (let j = 0; j < mapping.length; j++) {
			// If key exists in row
			if (mapping[j][1] in row) {
				// If nullable not allowed
				if (!mapping[j][2].includes("nullable")) {
					// Check if null, undefined or empty
					if (row[mapping[j][1]] === null || row[mapping[j][1]] === undefined || row[mapping[j][1]] === "") {
						canPush = false;
					}
				}

				if (canPush) {
					if (mapping[j][2].includes("deduplicate")) {
						const rowInCleanData = cleanData.find((r) => r[mapping[j][1]] === row[mapping[j][1]]);

						if (rowInCleanData) {
							canPush = false;
							console.log(false);
						}
					}
				}
			}
		}

		if (canPush) {
			cleanData.push(row);
		}
	}

	return cleanData;
};
