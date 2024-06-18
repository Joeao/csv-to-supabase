import DatabaseSchema from "@/data/schema.json";

export const getForeignKeys = (tableName: string, activeSchema: keyof typeof DatabaseSchema["properties"] = "public"): {
	foreignKeys: string[];
	relations: string[];
	columns: string[];
 } => {
	let foreignKeys: string[] = [];
	let relations: string[] = [];
	let columns: string[] = [];
	const tables = (DatabaseSchema.properties[activeSchema]).properties.Tables;

	try {
		const typedItems = (tables.properties[tableName as keyof typeof tables.properties].properties.Relationships as any).items as {
			properties: {
				columns: {
					items: {
						const: string;
					}[];
				};
				referencedRelation: {
					const: string;
				};
				referencedColumns: {
					items: {
						const: string;
					}[];
				};
		}; }[];

		foreignKeys = typedItems?.map((item) => item.properties.columns.items[0].const) || [];
		relations = typedItems?.map((item) => item.properties.referencedRelation.const) || [];
		columns = typedItems?.map((item) => item.properties.referencedColumns.items[0].const) || [];
	} catch {
		console.log("No foreign keys");
	}

	return {
		foreignKeys,
		relations,
		columns,
	};
};
