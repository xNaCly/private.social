import { useState, useRef } from "react";
import { xfetch, ROUTES } from "../util/fetch";
import { setToken } from "../util/util";
import { Link } from "react-router-dom";

// TODO: update password requirements being met while changes happen to the input box
export default function Signup({ bearerUpdater }: { bearerUpdater: any }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const [error, setError] = useState("");

	function updateToken(data: object) {
		//@ts-expect-error: token unknown on data, should be there because the error is handled before
		let token = data.token;
		setToken(token);
		bearerUpdater(token);
	}

	function signup() {
		// reset error if user tries to signup again
		setError("");
		//@ts-expect-error
		usernameRef?.current?.classList.remove("border-red-300");
		//@ts-expect-error
		passwordRef?.current?.classList.remove("border-red-300");
		let asyncfun = async () => {
			let { data, error } = await xfetch(ROUTES.register, {
				body: { username, password },
				method: "POST",
			});

			if (error) {
				setError(error);
				if (error.toLowerCase().includes("username"))
					//@ts-expect-error
					usernameRef?.current?.classList.add("border-red-300");
				if (error.toLowerCase().includes("password"))
					//@ts-expect-error
					passwordRef?.current?.classList.add("border-red-300");
				return;
			}

			console.info("User registered...");
			updateToken(data);
		};

		asyncfun();
	}

	return (
		<>
			<div
				className="flex items-center justify-center m-auto h-screen w-full"
				style={{ minWidth: "24rem" }}
			>
				<div
					className="p-4 px-8 rounded border max-w-sm"
					style={{ minWidth: "24rem" }}
				>
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
								ref={usernameRef}
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
								ref={passwordRef}
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
						<div className="mt-1">
							<Link
								to="/"
								className="text-sm text-trantlabs hover:text-trantlabs-darker"
							>
								Login instead
							</Link>
						</div>
						<div>
							<button
								className="mt-4 bg-trantlabs rounded p-2 mt-4 w-full text-white font-bold hover:bg-trantlabs-darker"
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
