import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken, isBackendAvailable } from "./util/util";

import Navigation from "./components/Navigation";
import Error from "./screens/Error";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Post from "./screens/Post";
import Home from "./screens/Home";

import "./index.css";

export default function App() {
	const [bearer, setBearer] = useState<string | null>(getToken());
	const [backendAvailable, setBackendAvailable] = useState<boolean>(true);

	function updateBearer(bearer: string | null) {
		setBearer(bearer);
	}

	useEffect(() => {
		(async () => {
			setBackendAvailable(await isBackendAvailable());
		})();
	}, []);

	return (
		<>
			{backendAvailable ? (
				<Router>
					<div className="lg:mx-6 md:mx-6 sm:mx-0">
						{bearer && <Navigation />}
						<Routes>
							{!bearer ? (
								<>
									<Route
										index
										element={
											<Login
												bearerUpdater={updateBearer}
											/>
										}
									/>
									<Route
										path="/signup"
										element={
											<Signup
												bearerUpdater={updateBearer}
											/>
										}
									/>
									<Route
										path="*"
										element={<Navigate to="/" replace />}
									/>
								</>
							) : (
								<>
									<Route index element={<Home />} />
									<Route
										path="profile"
										element={<Profile />}
									/>
									<Route
										path="post/:postId"
										element={<Post />}
									/>
									<Route
										path="login"
										element={<Navigate to="/" replace />}
									/>
									<Route
										path="signup"
										element={<Navigate to="/" replace />}
									/>
									<Route path="*" element={<Error />} />
								</>
							)}
						</Routes>
					</div>
				</Router>
			) : (
				<>
					<div className="flex flex-col items-center justify-center h-screen">
						<h1 className="text-4xl font-bold">
							Backend is not available, the instance hoster did
							not configure private.social correctly!
						</h1>
					</div>
				</>
			)}
		</>
	);
}
