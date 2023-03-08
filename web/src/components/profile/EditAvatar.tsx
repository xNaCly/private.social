import { User } from "../../models/User";

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
						<h1 className="my-2 mt-4 text-2xl select-none">
							Change Profile Photo
						</h1>
						<button>Upload Photo</button>
						<button>Remove current Photo</button>
						<button>Cancel</button>
					</div>
				</div>
			</div>
		</>
	);
}
