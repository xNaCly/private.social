import Navigation from "./components/Navigation";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useState } from "react";
import { getToken, isBackendAvailable } from "./util/util";

import Error from "./screens/Error";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Home from "./screens/Home";

import "./index.css";

let backendAvailable = await isBackendAvailable();
console.log(backendAvailable);

export default function App() {
	const [bearer, setBearer] = useState<string | null>(getToken());

	function updateBearer(bearer: string | null) {
		setBearer(bearer);
	}

	return (
		<>
			{backendAvailable ? (
				<Router>
					<div className="mx-6">
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
									<Route path="*" element={<Error />} />
								</>
							) : (
								<>
									<Route index element={<Home />} />
									<Route
										path="profile"
										element={<Profile />}
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
