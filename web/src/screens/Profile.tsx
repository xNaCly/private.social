import { User } from "../models/User";
import { Lock, Unlock, Settings, Edit, Share } from "react-feather";

export default function Profile() {
	const data: User = {
		bio: {
			text: "Hi, I’m Matteo, a 19 year old student from Germany. I am interested in programming, tech and hardware. In my freetime I like to contribute to free and open source software, as well as writing my own quality of life improving projects.",
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
	return (
		<div className="p-8 px-24 flex flex-col items-start justify-center">
			<div className="flex items-start justify-center w-full">
				<img
					src={data.avatar}
					className="rounded-full w-40 cursor-pointer"
				/>
				<div className="ml-8 flex flex-col items-start grow">
					<div className="flex items-center">
						<h3 className="text-lg">{data.display_name}</h3>
						<button className="hover:bg-gray-300 mx-3 px-3 py-1 flex justify-center rounded bg-gray-200 flex items-center transition-all">
							Edit Profile
						</button>
						<button className="flex items-center justify-center">
							<Settings size={16} className="" />
						</button>
					</div>
					<div className="flex my-8">
						<div className="flex items-center">
							<h3 className="font-bold mr-1">
								{data.stats.posts}
							</h3>
							<p>Posts</p>
						</div>
						<div className="flex mx-4 items-center">
							<h3 className="font-bold mr-1">
								{data.stats.followers}
							</h3>
							<p>Followers</p>
						</div>
						<div className="flex mx-4 items-center">
							<h3 className="font-bold mr-1">
								{data.stats.following}
							</h3>
							<p>Following</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
