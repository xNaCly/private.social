import { XCircle } from "react-feather";
import { useState, useEffect } from "react";

import Notification from "./Notification";
export default function NotificationModal({ closeNotificationModal }: any) {
	const [notifications, setNotifications] = useState([]) as any;

	useEffect(() => {
		// TODO: Fetch notifications from API
		setNotifications([
			{ title: "Notification 1", author: "Trantlabs", time: new Date() },
			{ title: "Notification 2", author: "Trantlabs", time: new Date() },
		]);
	}, []);

	return (
		<div className="backdrop-blur-[2px] fixed z-1 top-0 left-0 min-w-full min-h-full flex justify-center items-center">
			<div className="bg-white flex flex-col justify-center items-center rounded border p-4 w-1/2">
				<div className="flex justify-between items-center w-full">
					<h1 className="mr-2 text-xl">Notifications</h1>
					<button onClick={closeNotificationModal}>
						<XCircle size={22} />
					</button>
				</div>
				<div className="flex justify-center items-center flex-col w-full p-4">
					{notifications.map(
						(notification: {
							title: string;
							author: string;
							time: Date;
						}) => (
							<Notification {...notification} />
						)
					)}
				</div>
			</div>
		</div>
	);
}
