import { IUser } from "../models/User";
import { ROUTES, xfetch } from "../util/fetch";
import { getToken, removeToken } from "../util/util";
import { useState, useEffect } from "react";
import { IPost } from "../models/Post";
import Edit from "../components/profile/Edit";
import EditAvatar from "../components/profile/EditAvatar";
import { MapPin, CameraOff, User as UserIcon } from "react-feather";
import { Link } from "react-router-dom";

// TODO: restrictions:
// - username: max 30chars
// - display name: max 30chars
// - bio: max 160chars
// - pronouns: max 15chars
// - location: max 30chars

export default function Profile() {
	const [user, setUser] = useState<IUser>();
	const [posts, setPosts] = useState<IPost[]>([]);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [editAvatarModalOpen, setEditAvatarModalOpen] = useState(false);

	useEffect(() => {
		if (!getToken()) window.location.reload();
		if (!user) {
			let res = async () => {
				let { data } = await xfetch(ROUTES.me, {
					token: getToken() || "",
				});
				if (data == null) {
					removeToken();
					window.location.reload();
					return;
				}
				setUser(data.user as IUser);
			};
			res();
		}
		let res = async () => {
			let { data } = await xfetch(ROUTES.posts, {
				token: getToken() || "",
			});
			if (data == null) {
				return;
			} else {
				setPosts(data?.posts as IPost[]);
			}
		};
		res();
	}, []);

	return (
		<>
			{settingsModalOpen && user && (
				<Edit
					user={user}
					updateUser={(u: IUser) => setUser(u)}
					closeSettingsModal={() => setSettingsModalOpen(false)}
				/>
			)}
			{editAvatarModalOpen && user && (
				<EditAvatar
					user={user}
					updateUser={(u: IUser) => setUser(u)}
					closeEditAvatarModal={() => setEditAvatarModalOpen(false)}
				/>
			)}
			<div className="p-8 lg:px-24 md:px-12 px-0 flex flex-col items-start justify-center w-full">
				<div className="flex items-start justify-center w-full">
					<div onClick={() => setEditAvatarModalOpen(true)}>
						{user?.avatar ? (
							<img
								src={user?.avatar}
								className="rounded-full md:w-40 md:h-40 h-20 w-20 cursor-pointer border aspect-square"
							/>
						) : (
							<div className="border rounded-full md:w-40 md:h-40 h-20 w-20 cursor-pointer flex justify-center items-center bg-gray-100 text-gray-400 aspect-square">
								<UserIcon size={48} />
							</div>
						)}
					</div>
					<div className="lg:ml-8 ml-2 mt-2 mb-6 flex flex-col items-start">
						<div className="flex items-center">
							<h3 className="text-2xl">{user?.name}</h3>
							<button
								onClick={() => setSettingsModalOpen(true)}
								className="hover:bg-gray-300 mx-3 px-3 py-1 flex justify-center rounded bg-gray-200 flex items-center transition-all"
							>
								Edit Profile
							</button>
						</div>
						<div className="flex my-4">
							<div className="flex mr-4 items-center">
								<h3 className="font-bold mr-1">
									{user?.stats.posts}
								</h3>
								<p>Posts</p>
							</div>
							<div className="flex mr-4 items-center">
								<h3 className="font-bold mr-1">
									{user?.stats.followers}
								</h3>
								<p>Followers</p>
							</div>
							<div className="flex items-center">
								<h3 className="font-bold mr-1">
									{user?.stats.following}
								</h3>
								<p>Following</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex my-1 items-center">
								<span className="mr-2">
									@{user?.display_name}
								</span>
								<span className="mx-2 text-gray-400">
									{user?.bio.pronouns}
								</span>
								<div className="mx-2 flex items-center">
									{user?.bio.location && (
										<MapPin size={14} className="mr-1" />
									)}
									{user?.bio.location}
								</div>
							</div>
							<span className="my-1 max-w-lg">
								{user?.bio.text}
							</span>
							<span>
								<a
									className="my-1 text-trantlabs hover:text-gray-500"
									href={user?.bio.website}
									target="_blank"
								>
									{user?.bio.website}
								</a>
							</span>
						</div>
					</div>
				</div>
				<div className="flex justify-center w-full"></div>
				<div className="flex items-start justify-center w-full">
					{!posts.length ? (
						<div className="flex flex-col justify-center items-center w-1/2">
							<div className="flex flex-col justify-center items-center my-60">
								<CameraOff
									size={32}
									className="text-gray-400"
								/>
								<span className="text-lg text-gray-400">
									No posts yet
								</span>
							</div>
						</div>
					) : (
						<div
							className="pt-8 grid grid-cols-3 mt-6 lg:w-3/4 xl:w-1/2 w-full lg:px-8 lg:gap-8 md:gap-4 sm:gap-2 gap-1 place-items-center"
							style={{
								borderTopWidth: "1px",
								gridTemplateRows: "auto",
							}}
						>
							{posts.map((p) => (
								<Link to={`/post/${p.id}`}>
									<img
										className="lg:w-80 md:w-60 min-w-40 min-h-40 cursor-pointer hover:saturate-0"
										src={p.url}
										alt={p.description}
										key={p.id}
									/>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
