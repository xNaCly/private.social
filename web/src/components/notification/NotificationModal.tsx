import { XCircle, Bell } from "react-feather";
import { useState, useEffect } from "react";

import Notification from "./Notification";
import { INotification } from "../../models/Notification";
export default function NotificationModal({ closeNotificationModal }: any) {
	const [notifications, setNotifications] = useState([]) as any;

	useEffect(() => {
		// TODO: Fetch notifications from API
		setNotifications([
			{
				id: 0,
				type: "likepost",
				author: "Trantlabs",
				link: "/post/0",
				createdAt: new Date(),
			},
			{
				id: 1,
				type: "likestory",
				author: "Trantlabs",
				link: "/post/0",
				createdAt: new Date(),
			},
			{
				id: 2,
				type: "comment",
				message: "Great post",
				author: "Trantlabs",
				link: "/post/0",
				createdAt: new Date(),
			},
			{
				id: 3,
				type: "follow",
				author: "Trantlabs",
				link: "/post/0",
				createdAt: new Date(),
			},
			{
				id: 4,
				type: "newpost",
				author: "Trantlabs",
				link: "/post/0",
				createdAt: new Date(),
			},
		]);
	}, []);

	return (
		<div
			className="backdrop-blur fixed z-1 top-0 left-0 min-w-full min-h-full flex justify-center items-center"
			onClick={closeNotificationModal}
		>
			<div
				className="bg-white flex flex-col justify-center items-center rounded-md border p-4 w-1/2 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center w-full">
					<div className="flex justify-between items-center">
						<Bell size={22} />
						<h1 className="mx-2 text-xl">Notifications</h1>
					</div>
					<button onClick={closeNotificationModal}>
						<XCircle size={22} />
					</button>
				</div>
				<div className="flex justify-center items-center flex-col w-full p-4">
					{notifications.map((notification: INotification) => (
						<Notification
							key={notification.id}
							data={notification}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
