import { useContext, type JSX } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import DataContext from "@/context/Data.context";

interface Props {
	header: string;
}

const Options = (props: Props): JSX.Element => {
	const data = useContext(DataContext);

	const check = (checked: boolean, checkValue: string, header: string): void => {
		const headerIndex = data.mapping.findIndex((el) => el[0] === header);

		if (headerIndex >= -1) {
			const newMapping = [...data.mapping];
			const index = newMapping.findIndex((val) => {
				return val[2].includes(checkValue);
			});

			if (index > -1 && !checked) {
				newMapping[headerIndex][2].splice(index, 1);
			} else if (checked) {
				newMapping[headerIndex][2].push(checkValue);
			}

			data.setMapping(newMapping);
		}
	};

	const renderCheckbox = (checkValue: string): JSX.Element => {
		return (
			<div className={"flex items-center space-x-2"}>
				<Checkbox
					id={checkValue}
					disabled={disabled}
					onCheckedChange={(checked) => {
						check(checked as boolean, checkValue, props.header);
					}}
				/>

				<label
					htmlFor={checkValue}
					className={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
				>
					{checkValue}
				</label>
			</div>
		);
	};

	const disabled = !data.mapping.some((el) => el[0] === props.header);
	return (
		<div className={"flex gap-2 flex-col"}>
			{renderCheckbox("nullable")}

			{renderCheckbox("deduplicate")}
		</div>
	);
};

export default Options;
