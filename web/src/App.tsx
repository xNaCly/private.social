import Navigation from "./components/Navigation";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useState } from "react";
import { getToken } from "./util/util";

import Error from "./screens/Error";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Home from "./screens/Home";

import "./index.css";

export default function App() {
	const [bearer, setBearer] = useState<string | null>(getToken());

	function updateBearer(bearer: string | null) {
		setBearer(bearer);
	}

	return (
		<Router>
			<div className="mx-6">
				{bearer && <Navigation />}
				<Routes>
					{!bearer ? (
						<>
							<Route
								index
								element={<Login bearerUpdater={updateBearer} />}
							/>
							<Route
								path="/signup"
								element={
									<Signup bearerUpdater={updateBearer} />
								}
							/>
							<Route path="*" element={<Error />} />
						</>
					) : (
						<>
							<Route index element={<Home />} />
							<Route path="profile" element={<Profile />} />
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
	);
}
