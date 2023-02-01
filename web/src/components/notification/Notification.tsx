export default function Notification({
	title,
	author,
	time,
}: {
	title: string;
	author: string;
	time: Date;
}) {
	return (
		<div className="flex flex-col p-2 border rounded w-full m-1">
			<h3 className="text-lg">{title}</h3>
			<p className="text-sm">{author}</p>
			<span className="text-sm text-gray-500">
				{time.toLocaleString()}
			</span>
		</div>
	);
}
