import { useContext, type JSX } from "react";

import DataContext from "@/context/Data.context";

import Generic from "./Generic";

interface Props {
	defaultHeaders: boolean;
}

const SelectItems = (props: Props): JSX.Element => {
	const data = useContext(DataContext);

	// Each handled similarly - no data will be assigned
	const defaultHeaders = ["auto_generated", "not_set", "foreign_key"];

	return (
		<Generic items={(props.defaultHeaders ? [...defaultHeaders] : []).concat(data.headers)} />
	);
};

export default SelectItems;
