import type { JSX } from "react";
import CSVReader from "react-csv-reader";

import { Label } from "@/components/ui/label";

export function InputFile(): JSX.Element {
  return (
	<div className={"grid w-full max-w-sm items-center gap-1.5"}>
		<Label htmlFor={"csv"}>CSV</Label>

		<CSVReader
			parserOptions={{
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true,
				transformHeader: (header: string) => header
					.toLowerCase()
					.replace(/\W/g, "_"),
			}}
			onFileLoaded={(data) => {
				console.log(data);
			}}
		/>
	</div>
  );
}
