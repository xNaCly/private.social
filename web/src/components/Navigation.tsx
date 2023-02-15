import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Send, PlusCircle, User, Grid, Home } from "react-feather";
import NotificationModal from "./notification/NotificationModal";

export default function Navigation() {
	const [notificationModalOpen, setNotificationModalOpen] = useState(false);

	return (
		<>
			{notificationModalOpen && (
				<NotificationModal
					closeNotificationModal={() =>
						setNotificationModalOpen(false)
					}
				/>
			)}
			<nav className="flex justify-between items-center p-1 pt-2 mx-4">
				<div className="flex items-center">
					<Link
						className="m-1 p-3 text-lg flex justify-center items-center hover:text-trantlabs"
						to={"/"}
					>
						<Home size={22} className="mr-2 hover:text-trantlabs" />
						Feed
					</Link>
					{/*<Link
						className="m-1 p-3 text-lg flex justify-center items-center hover:text-trantlabs"
						to={"/explore"}
					>
						<Grid size={22} className="mr-2" />
						Explore
					</Link>*/}
					<Link
						className="m-1 p-3 text-lg flex justify-center items-center hover:text-trantlabs"
						to={"/profile"}
					>
						<User size={22} className="mr-2" />
						Profile
					</Link>
				</div>
				<div className="flex justify-center">
					<button
						className="m-1 p-3 hover:text-trantlabs"
						onClick={() =>
							setNotificationModalOpen(!notificationModalOpen)
						}
					>
						<Bell size={22} />
					</button>
					<button className="m-1 p-3 hover:text-trantlabs">
						<Send size={22} />
					</button>
					<div className="bg-trantlabs hover:shadow-lg hover:shadow-trantlabs/40 cursor-pointer m-1 p-2 px-4 flex justify-center items-center rounded text-white">
						<PlusCircle size={22} className="mr-2" />
						<span className="text-lg">Upload</span>
					</div>
				</div>
			</nav>
		</>
	);
}
