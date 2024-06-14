import type { Session } from "@supabase/supabase-js";
import { Fragment, useEffect, useState, type JSX } from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import { generated } from "@/data/schema";
import client from "@/lib/supabase";
import Error from "@/pages/Error";

import AuthEntry from "./components/AuthEntry";
import Entry from "./components/Entry";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

const unauthedRouter = createBrowserRouter([
	{
		path: "/",
		errorElement: <Error />,
		element: <AuthEntry />,
		children: [
		{
			index: true,
			element: <Navigate to={"/auth"} />,
		},
		{
			element: (
				<Auth />
			),
			path: "/auth",
		},
		],
	},
]);

const authedRouter = createBrowserRouter([
	{
	  path: "/",
	  errorElement: <Error />,
	  element: <Entry />,
	  children: [
		{
			index: true,
			element: <Navigate to={"/home"} />,
		},
		{
			element: (
				<Home />
			),
			path: "/home",
		},
	  ],
	},
]);

const App = (): JSX.Element => {
	// Bust app if schemas don't exist
	console.log("schemas generated", generated);

	const [session, setSession] = useState<Session | null>(null);
	const [checkedSession, setCheckedSession] = useState(false);
	const searchParams = new URLSearchParams(window.location.href?.split("#")[1]);

	const access_token = searchParams.get("access_token");
	const refresh_token = searchParams.get("refresh_token");

    useEffect(() => {
		const getSession = async (): Promise<void> => {
			if (access_token && refresh_token) {
				const { error } = await client().auth.setSession({
					access_token: access_token as string,
					refresh_token: refresh_token as string,
				});

				if (error) {
					console.log(error);
				}
			}

			const { data } = await client().auth.getSession();

			if (data.session) {
				setSession(data.session);
			}

			setCheckedSession(true);
		};

		getSession();

		const {
			data: { subscription },
		} = client().auth.onAuthStateChange((_event, currentSession) => {
			setSession(currentSession);
		});

		return () => subscription.unsubscribe();
	}, []);

	if (!checkedSession) {
		return <Fragment />;
	}

	return (
		<RouterProvider router={session ? authedRouter : unauthedRouter} />
	);
};

export default App;
