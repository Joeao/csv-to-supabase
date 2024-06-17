import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export interface Data {
	mapping: [string, string][];
	setMapping: Dispatch<SetStateAction<[string, string][]>>;
	headers: string[];
	setHeaders: Dispatch<SetStateAction<string[]>>;
}

export default createContext<Data>({} as Data);
