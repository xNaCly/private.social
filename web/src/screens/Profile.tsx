import { User } from "../models/User";
import { IPost } from "../models/Post";
import { Settings, MapPin } from "react-feather";

import Post from "../components/Post";

export default function Profile() {
	const data: User = {
		bio: {
			text: "Hi, I’m Matteo, a 20 year old student from Germany.Hi, I’m Matteo, a 19 year old student from Germany.Hi, I’m Matteo, a 19 year old student from Germany.Hi, I’m Matteo, a 19 year old student from Germany.",
			pronouns: "he/him",
			location: "Germany",
			website: "https://xnacly.me",
		},
		stats: {
			followers: 9,
			posts: 39,
			following: 4,
		},
		private: false,
		id: 1,
		name: "johndoe",
		display_name: "John Doe",
		link: "/johndoe/",
		avatar: "https://avatars.githubusercontent.com/u/47723417?v=4",
		created_at: new Date(Date.now()),
	};
	const posts: IPost[] = [
		{
			id: 0,
			data: {
				comments: 0,
				likes: 25,
				source: "https://avatars.githubusercontent.com/u/47723417?v=4",
				description: "New picture",
				website: "https://xnacly.me",
			},
			creator_ids: [data.id.toString()],
			created_at: new Date(),
		},
		{
			id: 1,
			data: {
				comments: 0,
				likes: 25,
				source: "https://avatars.githubusercontent.com/u/47723417?v=4",
				description: "New picture",
				website: "https://xnacly.me",
			},
			creator_ids: [data.id.toString()],
			created_at: new Date(),
		},
		{
			id: 2,
			data: {
				comments: 0,
				likes: 25,
				source: "https://avatars.githubusercontent.com/u/47723417?v=4",
				description: "New picture",
				website: "https://xnacly.me",
			},
			creator_ids: [data.id.toString()],
			created_at: new Date(),
		},
		{
			id: 3,
			data: {
				comments: 0,
				likes: 25,
				source: "https://avatars.githubusercontent.com/u/47723417?v=4",
				description: "New picture",
				website: "https://xnacly.me",
			},
			creator_ids: [data.id.toString()],
			created_at: new Date(),
		},
		{
			id: 4,
			data: {
				comments: 0,
				likes: 25,
				source: "https://avatars.githubusercontent.com/u/47723417?v=4",
				description: "New picture",
				website: "https://xnacly.me",
			},
			creator_ids: [data.id.toString()],
			created_at: new Date(),
		},
	];
	return (
		<div className="p-8 px-24 flex flex-col items-start justify-center w-full">
			<div className="flex items-start justify-center w-full">
				<img
					src={data.avatar}
					className="rounded-full w-60 cursor-pointer"
				/>
				<div className="ml-8 mt-2 mb-6 flex flex-col items-start">
					<div className="flex items-center">
						<h3 className="text-xl">{data.name}</h3>
						<button className="hover:bg-gray-300 mx-3 px-3 py-1 flex justify-center rounded bg-gray-200 flex items-center transition-all">
							Edit Profile
						</button>
						<button className="flex items-center justify-center">
							<Settings size={20} className="" />
						</button>
					</div>
					<div className="flex my-4">
						<div className="flex mr-8 items-center">
							<h3 className="font-bold mr-1">
								{data.stats.posts}
							</h3>
							<p>Posts</p>
						</div>
						<div className="flex mr-8 items-center">
							<h3 className="font-bold mr-1">
								{data.stats.followers}
							</h3>
							<p>Followers</p>
						</div>
						<div className="flex items-center">
							<h3 className="font-bold mr-1">
								{data.stats.following}
							</h3>
							<p>Following</p>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex my-1 items-center">
							<span className="mr-2">{data.display_name}</span>
							<span className="mx-2 text-gray-400">
								{data.bio.pronouns}
							</span>
							<div className="mx-2 flex items-center">
								<MapPin size={14} className="mr-1" />
								{data.bio.location}
							</div>
						</div>
						<span className="my-1 max-w-lg">{data.bio.text}</span>
						<a
							className="my-1 text-trantlabs hover:text-gray-500"
							href={data.bio.website}
						>
							{data.bio.website}
						</a>
					</div>
				</div>
			</div>
			<div className="mt-4 flex items-start justify-center w-full">
				<div
					className="grid lg:grid-cols-3 md:grid-cols-2 pt-8"
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
			</div>
		</div>
	);
}
