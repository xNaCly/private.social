import { User } from "../models/User";
import { ROUTES, xfetch } from "../util/fetch";
import { getToken, removeToken } from "../util/util";
import { useState, useEffect } from "react";
import { IPost } from "../models/Post";
import Edit from "../components/profile/Edit";
import { MapPin, CameraOff, User as UserIcon } from "react-feather";

export default function Profile() {
	const [user, setUser] = useState<User>();
	const [posts, setPosts] = useState<IPost[]>([]);
	const [editModalOpen, setEditModalOpen] = useState(false);

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
				setUser(data.user as User);
			};
			res();
		}
	}, []);

	return (
		<>
			{editModalOpen && user && (
				<Edit
					user={user}
					updateUser={(u: User) => setUser(u)}
					closeNotificationModal={() => setEditModalOpen(false)}
				/>
			)}
			<div className="p-8 px-24 flex flex-col items-start justify-center w-full">
				<div className="flex items-start justify-center w-full">
					{user?.avatar ? (
						<img
							src={user?.avatar}
							className="rounded-full w-60 h-60 cursor-pointer"
						/>
					) : (
						<div className="rounded-full w-60 h-60 cursor-pointer flex justify-center items-center bg-gray-100 text-gray-400">
							<UserIcon size={48} />
						</div>
					)}
					<div className="ml-8 mt-2 mb-6 flex flex-col items-start">
						<div className="flex items-center">
							<h3 className="text-xl">{user?.name}</h3>
							<button
								onClick={() => setEditModalOpen(true)}
								className="hover:bg-gray-300 mx-3 px-3 py-1 flex justify-center rounded bg-gray-200 flex items-center transition-all"
							>
								Edit Profile
							</button>
						</div>
						<div className="flex my-4">
							<div className="flex mr-8 items-center">
								<h3 className="font-bold mr-1">
									{user?.stats.posts}
								</h3>
								<p>Posts</p>
							</div>
							<div className="flex mr-8 items-center">
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
									{user?.display_name}
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
							<a
								className="my-1 text-trantlabs hover:text-gray-500"
								href={user?.bio.website}
							>
								{user?.bio.website}
							</a>
						</div>
					</div>
				</div>
				<div className="mt-4 flex items-start justify-center w-full">
					{!posts.length ? (
						<div
							className="flex flex-col justify-center items-center pt-8 w-1/2"
							style={{ borderTopWidth: "1px" }}
						>
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
							className="grid lg:grid-cols-3 md:grid-cols-2 pt-8 w-1/2"
							style={{ borderTopWidth: "1px" }}
						>
							{posts.map((p) => (
								<a
									href={`posts/${p.id}`}
									className="hover:brightness-75"
									key={p.id}
								>
									<img
										className="m-2 w-80"
										src={p.data.source}
										key={p.id}
									/>
								</a>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
