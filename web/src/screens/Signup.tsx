import { useEffect, useState } from "react";

export default function Signup({ bearerUpdater }: { bearerUpdater: any }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	function signup() {
		// TODO: make post request to localhost:8000/v1/signup
		setError(new Date().toString());
	}

	return (
		<>
			<div className="flex items-center justify-center m-auto h-screen max-w-sm">
				<div className="p-4 px-8 rounded border">
					<div className="my-4 flex flex-col justify-center items-center">
						<h1 className="font-bold text-trantlabs rounded text-5xl">
							Sign-up
						</h1>
					</div>
					{error && (
						<div className="mt-4 rounded border p-2 bg-red-100 border-red-300">
							<h3>An Error occured:</h3>
							<p className="text-gray-500">{error}</p>
						</div>
					)}
					<div className="my-4">
						<div className="my-2 flex flex-col">
							<label
								htmlFor="username"
								className="font-bold text-sm text-gray-50 text-gray-600"
							>
								Username:
							</label>
							<input
								className="border rounded p-1 mt-1 outline-trantlabs outline-1"
								name="username"
								type="text"
								placeholder="Username"
								onChange={(e) => setUsername(e.target.value)}
							></input>
						</div>
						<div className="my-4 flex flex-col">
							<label
								htmlFor="password"
								className="font-bold text-sm text-gray-50 text-gray-600"
							>
								Password:
							</label>
							<input
								className="border rounded p-1 mt-1 outline-trantlabs outline-1"
								name="password"
								type="password"
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)}
							></input>
						</div>
						<div className="mt-4 rounded border p-2 bg-gray-100 border-gray-300">
							<h3 className="font-bold">
								Password Requirements:
							</h3>
							<p className="text-gray-600 text-sm">
								Your password needs to meet all of the following
								requirements:
							</p>
							<ul className="list-disc ml-5">
								<li>must be at least 10 characters long</li>
								<li>must contain 1 number 0-9</li>
								<li>must contain 1 uppercase letter A-Z</li>
								<li>must contain 1 symbol</li>
								<li>can't be the username</li>
								<li>can't contain the username</li>
							</ul>
						</div>
						<div>
							<button
								className="mt-8 bg-trantlabs rounded p-2 mt-4 w-full text-white font-bold hover:bg-trantlabs-darker"
								onClick={() => signup()}
							>
								Sign-up
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
