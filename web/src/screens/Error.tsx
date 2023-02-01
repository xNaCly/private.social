import { AlertCircle } from "react-feather";
export default function Error() {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<div className="flex justify-center items-center flex-col">
				<AlertCircle className="mb-2" size={58} />
				<h1 className="text-9xl font-bold m-4">404</h1>
				<p className="text-lg italic">page not found</p>
			</div>
		</div>
	);
}
