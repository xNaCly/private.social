import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Send, PlusCircle, User, Grid, Home } from "react-feather";
import { NavLink } from "react-router-dom";
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
				<div className="flex items-center justify-center">
					<NavLink
						className={({ isActive }) => {
							return `m-1 p-3 text-lg flex justify-center items-center hover:bg-gray-200 rounded ${
								isActive ? "text-trantlabs" : ""
							}`;
						}}
						to={"/"}
					>
						<Home size={22} className="mr-2" />
						Feed
					</NavLink>
					<NavLink
						className={({ isActive }) => {
							return `m-1 p-3 text-lg flex justify-center items-center hover:bg-gray-200 rounded ${
								isActive ? "text-trantlabs" : ""
							}`;
						}}
						to={"/profile"}
					>
						<User size={22} className="mr-2" />
						Profile
					</NavLink>
				</div>
				<div className="flex justify-center items-center">
					{/*
                    <button
						className="m-1 p-3 hover:bg-gray-200 rounded"
						onClick={() =>
							setNotificationModalOpen(!notificationModalOpen)
						}
					>
						<Bell size={22} />
					</button>
					<button className="m-1 p-3 hover:bg-gray-200 rounded">
						<Send size={22} />
					</button>*/}
					<div className="bg-trantlabs hover:shadow-lg hover:shadow-trantlabs/40 cursor-pointer m-1 p-2 px-4 flex justify-center items-center rounded text-white transition-all">
						<PlusCircle size={22} className="mr-2" />
						<span className="text-lg">Upload</span>
					</div>
				</div>
			</nav>
		</>
	);
}
