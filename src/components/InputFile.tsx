import type { JSX } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputFile(): JSX.Element {
  return (
	<div className={"grid w-full max-w-sm items-center gap-1.5"}>
		<Label htmlFor={"csv"}>CSV</Label>

		<Input
			id={"csv"}
			type={"file"}
		/>
	</div>
  );
}
