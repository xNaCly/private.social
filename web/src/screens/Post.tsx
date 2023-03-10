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
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
					{deleteModalOpen && <div>test</div>}
					<div className="mt-24 w-full flex justify-center items-center">
						<div className="border flex lg:w-1/2">
							<img src={post?.url}></img>
							<div className="flex flex-col items-center justify-start w-full">
								<div
									className="flex flex-col items-start p-4 w-full"
									style={{ borderBottomWidth: "1px" }}
								>
									<div className="flex items-center">
										<div className="flex items-center">
											<img
												className="rounded-full w-10 h-10 mr-4 mr-4"
												src={user?.avatar}
											></img>
											<h3 className="font-bold">
												{user?.display_name}
											</h3>
										</div>
									</div>
									<span
										className="pt-4 max-w-xs"
										style={{
											inlineSize: "max-content",
											overflowWrap: "break-word",
										}}
									>
										{post?.description}
									</span>
									<span className="mt-2 text-gray-500 text-sm">
										{formatDate(post.created_at)}
									</span>
								</div>
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
