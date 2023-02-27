import { useState, useRef } from "react";
import { xfetch, ROUTES } from "../util/fetch";
import { setToken } from "../util/util";
import { Link } from "react-router-dom";

export default function Login({ bearerUpdater }: { bearerUpdater: any }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const [error, setError] = useState("");

	function updateToken(res: object) {
		//@ts-expect-error: token unknown on data, should be there because the error is handled before
		let token = res.data.token;
		setToken(token);
		bearerUpdater(token);
	}

	function login() {
		// reset error if user tries to signup again
		setError("");
		//@ts-expect-error
		usernameRef?.current?.classList.remove("border-red-300");
		//@ts-expect-error
		passwordRef?.current?.classList.remove("border-red-300");

		let asyncfun = async () => {
			let res = await xfetch(ROUTES.register, {
				body: { username, password },
				method: "POST",
			});

			let err = res.message;

			if (!res.success) {
				setError(err);
				if (err.toLowerCase().includes("username"))
					//@ts-expect-error
					usernameRef?.current?.classList.add("border-red-300");
				if (err.toLowerCase().includes("password"))
					//@ts-expect-error
					passwordRef?.current?.classList.add("border-red-300");
				return;
			}

			console.info("User registered...");
			updateToken(res);
		};

		asyncfun();
	}

	return (
		<>
			<div className="flex items-center justify-center m-auto h-screen w-full">
				<div
					className="p-4 px-8 rounded border max-w-sm"
					style={{ minWidth: "24rem" }}
				>
					<div className="my-4 flex flex-col justify-center items-center">
						<h1 className="font-bold text-trantlabs rounded text-5xl">
							Login
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
						<div className="mt-4 flex flex-col">
							<label
								htmlFor="password"
								className="font-bold text-sm text-gray-50 text-gray-600"
							>
								Password:
							</label>
							<input
								className="border rounded p-1 mt-1 outline-trantlabs outline-1"
								name="password"
								type={passwordVisible ? "text" : "password"}
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)}
								ref={passwordRef}
							></input>
						</div>
						<div className="mt-1 mb-3 flex justify-between items-center">
							<Link
								to="/signup"
								className="text-sm text-trantlabs hover:text-trantlabs-darker"
							>
								Sign up instead
							</Link>
							<div>
								<label
									htmlFor="viewPassword"
									className="text-sm text-gray-500 mr-1"
								>
									View Password
								</label>
								<input
									type="checkbox"
									id="viewPassword"
									onClick={() =>
										setPasswordVisible(!passwordVisible)
									}
								/>
							</div>
						</div>
						<div>
							<button
								className="mt-4 bg-trantlabs rounded p-2 mt-4 w-full text-white font-bold hover:bg-trantlabs-darker"
								onClick={() => login()}
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
