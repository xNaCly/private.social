import { useState } from "react";
import { uploadCdn } from "../../util/fetch";
import { Image } from "react-feather";

export default function CreatePostModal({
	closeUploadModal,
}: {
	closeUploadModal: () => void;
}) {
	const [imagePath, setImagePath] = useState("");

	function uploadPhotoToCdn(e: EventTarget) {
		let element = e as HTMLInputElement;
		if (element.files?.length === 0) return;
		// ! operator is used to tell the compiler that the file is not null, it can't be null because we checked the length of the files array
		let file = element.files?.[0]!;
		if (file) {
			let upload = async () => {
				let res = await uploadCdn(file);
				if (res.success) {
					setImagePath(`/cdn${res.data.path}`);
				}
			};
			upload();
		}
	}

	return (
		<div
			className="fixed z-1 top-0 left-0 min-w-full min-h-full flex justify-center items-center bg-gray-900 bg-opacity-70"
			onClick={closeUploadModal}
		>
			<div
				className="bg-white flex flex-col justify-center items-center rounded-md border lg:w-1/2 w-3/4 shadow-2xl max-w-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col justify-center items-center w-full">
					<div className="border-b-[1px] mb-4 py-4 w-full flex items-center justify-center">
						<h1 className="text-xl select-none">Create new post</h1>
					</div>
					<div className="flex justify-center items-center mb-4">
						{imagePath ? (
							<img
								src={imagePath}
								alt="uploaded image"
								className="border w-32 h-32 lg:w-64 lg:h-64 rounded-md"
							/>
						) : (
							<div className="border bg-gray-100 w-32 h-32 lg:w-64 lg:h-64 rounded-md text-gray-400 flex items-center justify-center">
								<Image size={64} className="stroke-1" />
							</div>
						)}
					</div>
					{imagePath && (
						<button
							className="text-center cursor-pointer font-bold text-red-500 text-lg py-4 border-t-[1px] border-gray-300 w-full"
							onClick={() => setImagePath("")}
						>
							Remove Photo
						</button>
					)}
					{!imagePath && (
						<label
							className="text-center cursor-pointer font-bold text-blue-500 text-lg py-4 border-t-[1px] border-gray-300 w-full"
							onChange={(e) => uploadPhotoToCdn(e.target)}
						>
							<input
								type="file"
								className="hidden"
								accept=".png,.jpg,.jpeg,.gif,.webp,.heic"
							/>
							Upload Photo
						</label>
					)}
				</div>
			</div>
		</div>
	);
}
