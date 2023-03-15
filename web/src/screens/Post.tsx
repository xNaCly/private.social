import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../util/util";
import { IPost } from "../models/Post";
import { IUser } from "../models/User";
import Error from "./Error";
import { xfetch, ROUTES } from "../util/fetch";
import { formatDate } from "../util/util";

export default function Post() {
	const { postId } = useParams();
	const [post, setPost] = useState<IPost | undefined>();
	const [user, setUser] = useState<IUser | undefined>();

	useEffect(() => {
		let postReq = async () => {
			let resPost = await xfetch(ROUTES.post + postId, {
				method: "GET",
				token: getToken() || "",
			});
			if (resPost.success) {
				setPost(resPost.data.post as IPost);
				let resUser = await xfetch(
					ROUTES.user + resPost.data.post.author,
					{
						method: "GET",
						token: getToken() || "",
					}
				);
				if (resUser.success) {
					setUser(resUser.data.user as IUser);
				}
			}
		};
		postReq();
	}, []);

	return (
		<>
			{post ? (
				<>
					<div className="mb-8 mt-4 w-full flex justify-center items-center">
						<div className="border flex flex-col lg:w-1/2 items-start justify-start max-w-fit">
							<div className="flex items-center flex-col p-4">
								<div className="flex items-center">
									<img
										className="rounded-full w-10 h-10 mr-4 mr-2"
										src={user?.avatar}
									></img>
									<h3 className="font-bold">
										{user?.display_name}
									</h3>
								</div>
							</div>
							<img
								src={post?.url}
								className="max-w-1/2 border-y-[1px]"
							></img>
							<div className="flex flex-col items-start p-4">
								<span className="pr-4 break-all">
									{post?.description}
								</span>
								<span className="mt-2 text-gray-500 text-sm w-full">
									{formatDate(post.created_at)}
								</span>
							</div>
						</div>
					</div>
				</>
			) : (
				<Error />
			)}
		</>
	);
}
