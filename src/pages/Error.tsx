import type { JSX } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorContainer(): JSX.Element {
	const error = useRouteError();

	const errorMessage = (): string => {
		if (isRouteErrorResponse(error)) {
			return `${error.status} ${error.statusText}`;
		} else if (error instanceof Error) {
			return error.message;
		} else if (typeof error === "string") {
			return error;
		}

		console.error(error);
		return "Unknown error";
	};

	return (
		<div>
			<p>Sorry, an unexpected error has occurred.</p>

			<p>{errorMessage()}</p>
		</div>
	);
}
