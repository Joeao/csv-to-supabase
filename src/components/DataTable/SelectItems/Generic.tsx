import { type JSX } from "react";

import { SelectContent, SelectItem } from "@/components/ui/select";

interface Props {
	items: string[];
}

const TableSummary = (props: Props): JSX.Element => {
	return (
		<SelectContent>
			{props.items.flatMap((val) => {
				if (!val?.length) {
					return [];
				}

				return (
					<SelectItem
						value={val}
						key={val}
					>
						{val}
					</SelectItem>
				);
			})}
		</SelectContent>
	);
};

export default TableSummary;
