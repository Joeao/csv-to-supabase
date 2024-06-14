import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { JSX } from "react";

import client from "@/lib/supabase";

const dev = import.meta.env.DEV;
export default function Component(): JSX.Element {
	return (
		<Auth
			supabaseClient={client()}
			providers={["linkedin", "apple", "google"]}
			appearance={{
				theme: ThemeSupa,
				style: {
					container: {
						flexGrow: 1,
					},
				},
				variables: {
					default: {
					  colors: {
						brand: "black",
						brandAccent: "black",
					  },
					},
				  },
			}}
			theme={"dark"}
			magicLink={true}
			showLinks={false}
			socialLayout={"horizontal"}
			redirectTo={dev ? "http://localhost:5173" : ""}
			view={"magic_link"}
		/>
	);
}
