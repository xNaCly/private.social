import { Link } from "react-router-dom";

export default function Navigation() {
	return (
		<nav>
			<ul>
				<li>
					<Link to={"/"}>Home</Link>
				</li>
				<li>
					<Link to={"/explore"}>Explore</Link>
				</li>
				<li>
					<Link to={"/profile"}>Profile</Link>
				</li>
			</ul>
		</nav>
	);
}
