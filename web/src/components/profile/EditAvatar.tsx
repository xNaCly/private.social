import { User } from "../../models/User";
import { ApiUpdateUserRequest } from "../../models/Api";
import { xfetch, ROUTES, uploadCdn } from "../../util/fetch";
import { getToken } from "../../util/util";

// TODO: prompt:
// TITLE: Change Profile Photo
// OPTIONS: - upload Photo
// OPTIONS: - remove current photo
// OPTIONS: - cancel
export default function EditAvatar({
	user,
	updateUser,
	closeEditAvatarModal,
}: {
	user: User;
	updateUser: (u: User) => void;
	closeEditAvatarModal: () => void;
}) {
	function uploadPhoto(e: EventTarget) {
		let element = e as HTMLInputElement;
		if (element.files?.length === 0) {
			return;
		}
		let file = element.files?.[0]!;
		if (file) {
			let f1 = async () => {
				let res = await uploadCdn(file);
				let path = "";
				if (res.success) {
					path = `/cdn${res.data.path}`;
					res = await xfetch(ROUTES.me, {
						method: "PUT",
						token: getToken() || "",
						body: {
							...user,
							avatar: path,
						} as ApiUpdateUserRequest,
					});
					console.log(res);
				}
				updateUser({
					...user,
					avatar: path,
				});
			};
			f1();
			closeEditAvatarModal();
		}
	}

	function removePhoto() {
		let f = async () => {
			let res = await xfetch(ROUTES.me, {
				method: "PUT",
				token: getToken() || "",
				body: {
					...user,
					avatar: "",
				} as ApiUpdateUserRequest,
			});
			console.log(res);
		};
		f();
		updateUser({
			...user,
			avatar: "",
		});
		closeEditAvatarModal();
	}

	return (
		<>
			<div
				className="fixed z-1 top-0 left-0 min-w-full min-h-full flex justify-center items-center bg-gray-900 bg-opacity-70"
				onClick={closeEditAvatarModal}
			>
				<div
					className="bg-white flex flex-col justify-center items-center rounded-md border w-1/2 shadow-2xl max-w-lg"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-col justify-center items-center w-full">
						<h1 className="my-8 text-2xl select-none">
							Change Profile Photo
						</h1>
						<label
							className="text-center cursor-pointer font-bold text-blue-500 text-lg py-4 border-t-[1px] border-gray-300 w-full"
							onChange={(e) => uploadPhoto(e.target)}
						>
							<input
								type="file"
								className="hidden"
								accept=".png,.jpg,.jpeg,.gif,.webp,.heic"
							/>
							Upload Photo
						</label>
						<button
							className="font-bold text-red-500 text-lg py-4 border-t-[1px] border-gray-300 w-full"
							onClick={() => removePhoto()}
						>
							Remove current Photo
						</button>
						<button
							className="text-lg py-4 border-t-[1px] border-gray-300 w-full"
							onClick={() => closeEditAvatarModal()}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
