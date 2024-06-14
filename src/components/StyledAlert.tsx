import { Terminal } from "lucide-react";
import type { JSX } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Props {
    content: string;
}

export function StyledAlert(props: Props): JSX.Element {
  return (
	<Alert>
		<Terminal className={"h-4 w-4"} />

		<AlertTitle>Heads up!</AlertTitle>

		<AlertDescription>
			{props.content}
		</AlertDescription>
	</Alert>
  );
}
