import type { Data } from "@/context/Data.context";
import DatabaseSchema from "@/data/schema.json";
import type DataRow from "@/interface/DataRow";
import client from "@/lib/supabase";

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
						}
					}
				}
			}
		}

		if (canPush) {
			if (!Object.values(row).every((val) => val !== "" && val !== null)) {
				cleanData.push(row);
			}
		}
	}

	return cleanData;
};

export const formatPropNames = (data: DataRow[], mapping: Data["mapping"], foreignKeyMapping: Data["foreignKeyMapping"]): DataRow[] => {
	return data.map((row) => {
		const formattedRow: Partial<DataRow> = {};

		for (const [key, value] of Object.entries(row)) {
			if (mapping.find((m) => m[1] === key)) {
				const matchedMapping = mapping.find((m) => m[1] === key);
				formattedRow[matchedMapping![0]] = value;
			}

			if (foreignKeyMapping.find((m) => m[2] === key)) {
				const matchedMapping = foreignKeyMapping.find((m) => m[2] === key);
				formattedRow[matchedMapping![2]] = value;
			}
		}

		return formattedRow as DataRow;
	});
};

export const mapForeignKeys = async (data: DataRow[], mapping: Data["foreignKeyMapping"]): Promise<DataRow[]> => {
	const tableNames = [...new Set(mapping.map(([_, tableName]) => tableName))];
	const clonedData = [...data];

	if (!mapping.length) {
		return Promise.resolve(data);
	}

	// Do these synchronously to not cripple Supabase
	for (let i = 0; i < tableNames.length; i++) {
		const name = tableNames[i];
		const existingData = [...new Set(data.flatMap((row) => {
			const mappingIndex = mapping.findIndex(([_, tableName]) => tableName === name);

			return row[mapping[mappingIndex][2]] || [];
		}))];

		let query = client()
			.from(name as any)
			.select(`${[...new Set(mapping.flatMap((val) => (val[1] === name ? [val[0], val[3]] : [])))].join(",")}`);

		// If less than 100 rows - otherwise we might get error & it's slow
		if (existingData.length < 100) {
			query = query.in(`${[...new Set(mapping.flatMap((val) => (val[1] === name ? val[3] : [])))]}`, existingData);
		}

		const response = await query;

		if (response.status < 300 && response.status >= 200 && response.data) {
			data.forEach((dataRow, dataIndex) => {
				const keys2 = Object.keys(dataRow);

				keys2.forEach((key) => {
					const mappedKeysIndexes = mapping.flatMap((val, index) => (val[2] === key ? index : []));

					mappedKeysIndexes.forEach((mappedKeys) => {
						if (mappedKeys > -1) {
							response.data.forEach((requestDataEntry) => {
								if (requestDataEntry[mapping[mappedKeys][3]] === dataRow[key]) {
									clonedData[dataIndex][mapping[mappedKeys][4]] = requestDataEntry[mapping[mappedKeys][0]];
								}
							});
						}
					});
				});
			});
		}
	}

	return clonedData;
};

export const cleanDataFields = (data: DataRow[], activeSchema: Data["activeSchema"], activeTable: Data["activeTable"]): DataRow[] => {
	const dataClone = [...data];

	const expectedKeys = Object.keys(DatabaseSchema.properties[activeSchema].properties.Tables.properties[activeTable].properties.Row.properties);

	dataClone.forEach((entry, dataIndex) => {
		const keys = Object.keys(entry);

		keys.forEach((key) => {
			if (!expectedKeys.includes(key)) {
				delete dataClone[dataIndex][key];
			}
		});
	});

	return dataClone;
};
