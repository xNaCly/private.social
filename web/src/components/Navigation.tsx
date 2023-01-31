import { Link } from "react-router-dom";

export default function Navigation() {
	return (
		<nav className="flex justify-between">
			<div>
				<Link to={"/"}>Home</Link>
				<Link to={"/explore"}>Explore</Link>
				<Link to={"/profile"}>Profile</Link>
			</div>
			<div>
				<button>Notifications</button>
				<button>Private Messages</button>
				<button>Upload</button>
			</div>
		</nav>
	);
}
