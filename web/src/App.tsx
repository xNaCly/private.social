import Navigation from "./components/Navigation";
import { Routes, Route } from "react-router-dom";
import Error from "./screens/Error";
import Profile from "./screens/Error";
import Home from "./screens/Home";

export default function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Navigation />}>
					<Route index element={<Home />} />
					<Route path="profile" element={<Profile />} />
					<Route path="*" element={<Error />} />
				</Route>
			</Routes>
		</div>
	);
}
