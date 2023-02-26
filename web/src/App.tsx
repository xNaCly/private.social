import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

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
				{!bearer ? (
					<Routes>
						<Route
							index
							element={<Login bearerUpdater={updateBearer} />}
						/>
						<Route
							path="/signup"
							element={<Signup bearerUpdater={updateBearer} />}
						/>
					</Routes>
				) : (
					<>
						<Navigation />
						<Routes>
							<Route index element={<Home />} />
							<Route path="profile" element={<Profile />} />
							<Route path="*" element={<Error />} />
						</Routes>
					</>
				)}
			</div>
		</Router>
	);
}
