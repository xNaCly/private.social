import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "./screens/Error";
import Profile from "./screens/Profile";
import Home from "./screens/Home";
import "./index.css";

export default function App() {
	return (
		<Router>
			<Navigation />
			<div className="mx-6">
				<Routes>
					<Route index element={<Home />} />
					<Route path="profile" element={<Profile />} />
					<Route path="*" element={<Error />} />
				</Routes>
			</div>
		</Router>
	);
}
