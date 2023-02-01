import { INotification } from "../../models/Notification";
export default function Notification({ data }: { data: INotification }) {
	// TODO: add icon for author
	// TODO: add image for post
	// TODO: add link to author
	// TODO: add link to post
	// TODO: format date: Days ago if not today, otherwise hours ago
	let date = "";
	let title = "";
	switch (data.type) {
		case "comment":
			title = `commented on your post.`;
			break;
		case "likestory":
			title = `liked your story.`;
			break;
		case "follow":
			title = `followed you.`;
			break;
		case "likepost":
			title = `liked your post.`;
			break;
		case "newpost":
			title = `uploaded a new post.`;
			break;
	}
	return (
		<div className="flex items-center justify-between p-2 border rounded w-full m-1">
			<h3 className="text-lg">
				<span className="font-bold">{data.author} </span>
				{title}
			</h3>
			<span className="text-gray-500 ml-2">{date}</span>
		</div>
	);
}
