import { User } from "../../models/User";
import { XCircle, Settings } from "react-feather";
import { useState } from "react";
import { xfetch, ROUTES } from "../../util/fetch";
import { getToken } from "../../util/util";
export default function Edit({
	user,
	updateUser,
	closeNotificationModal,
}: {
	user: User;
	updateUser: any;
	closeNotificationModal: any;
}) {
	const [bioText, setBioText] = useState(user.bio.text);
	const [displayName, setDisplayName] = useState(user.display_name);
	const [bioPronouns, setBioPronouns] = useState(user.bio.pronouns);
	const [bioLocation, setBioLocation] = useState(user.bio.location);
	const [bioWebsite, setBioWebsite] = useState(user.bio.website);

	function update() {
		let reqBody = {
			display_name: displayName,
			private: user.private,
			avatar: user.avatar,
			bio: {
				text: bioText,
				pronouns: bioPronouns,
				location: bioLocation,
				website: bioWebsite,
			},
		};
		xfetch(ROUTES.me, {
			body: reqBody,
			method: "PUT",
			token: getToken() || "",
		});
		updateUser({
			...user,
			...reqBody,
		});
		closeNotificationModal();
	}

	return (
		<div
			className="backdrop-blur fixed z-1 top-0 left-0 min-w-full min-h-full flex justify-center items-center"
			onClick={closeNotificationModal}
		>
			<div
				className="bg-white flex flex-col justify-center items-center rounded-md border p-4 w-1/2 shadow-2xl max-w-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center w-full">
					<div className="flex justify-between items-center">
						<Settings size={22} />
						<h1 className="mx-2 text-xl">Edit Profile</h1>
					</div>
					<button onClick={closeNotificationModal}>
						<XCircle size={22} />
					</button>
				</div>
				<div className="flex justify-center items-center flex-col w-full p-4">
					<div className="flex flex-col w-full my-2">
						<label
							htmlFor="display-name"
							className="font-bold text-gray-50 text-gray-600"
						>
							Name:
						</label>
						<input
							className="border rounded p-2 mt-1 outline-trantlabs outline-1"
							type="text"
							id="display-name"
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder={user.display_name}
						/>
					</div>
					<div className="flex flex-col w-full my-2">
						<label
							htmlFor="biography-text"
							className="font-bold text-gray-50 text-gray-600"
						>
							Biography:
						</label>
						<input
							className="border rounded p-2 mt-1 outline-trantlabs outline-1"
							type="text"
							id="biography-text"
							onChange={(e) => setBioText(e.target.value)}
							placeholder={user.bio.text}
						/>
					</div>
					<div className="flex flex-col w-full my-2">
						<label
							htmlFor="pronouns"
							className="font-bold text-gray-50 text-gray-600"
						>
							Pronouns:
						</label>
						<input
							className="border rounded p-2 mt-1 outline-trantlabs outline-1"
							type="text"
							id="pronouns"
							onChange={(e) => setBioPronouns(e.target.value)}
							placeholder={user.bio.pronouns}
						/>
					</div>
					<div className="flex flex-col w-full my-2">
						<label
							htmlFor="location"
							className="font-bold text-gray-50 text-gray-600"
						>
							Location:
						</label>
						<input
							className="border rounded p-2 mt-1 outline-trantlabs outline-1"
							type="text"
							id="location"
							onChange={(e) => setBioLocation(e.target.value)}
							placeholder={user.bio.location}
						/>
					</div>
					<div className="flex flex-col w-full my-2">
						<label
							htmlFor="website"
							className="font-bold text-gray-50 text-gray-600"
						>
							Website:
						</label>
						<input
							className="border rounded p-2 mt-1 outline-trantlabs outline-1"
							type="url"
							id="website"
							onChange={(e) => setBioWebsite(e.target.value)}
							placeholder={user.bio.website}
						/>
					</div>
					<div className="flex flex-col w-full my-2">
						<button
							className="mt-4 bg-trantlabs rounded p-2 mt-4 w-full text-white font-bold hover:bg-trantlabs-darker"
							onClick={() => update()}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
