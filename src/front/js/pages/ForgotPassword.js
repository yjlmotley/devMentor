import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
	const { store } = useContext(Context);
	const [hasToken, setHasToken] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setErrMsg] = useState('');

	const navigate = useNavigate();
	const token = store.token;

	useEffect(() => {
		if (token) {
			setHasToken(true);
		}
	}, [token]);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function validateEmail(email) {
		return emailRegex.test(email);
	}

	const handleEmailChange = (event) => {
		const enteredEmail = event.target.value;
		setEmail(enteredEmail);
		if (validateEmail(enteredEmail)) {
			setErrMsg("");
		}
	};

	async function handleSubmit(event) {
		event.preventDefault();
		if (!hasToken) {
			if (!validateEmail(email)) {
				setErrMsg("Please enter a valid email.");
				return;
			}
			try {
				const response = await fetch(process.env.BACKEND_URL + "/api/forgot-password", {
					method: "POST",
					headers: { 'Content-Type': "application/json" },
					body: JSON.stringify({ email: email.toLowerCase() })
				});
				if (response.ok) {
					alert("An email has been sent to reset your password.");
					setTimeout(() => {
						window.history.back(), 3000
					});
				} else {
					const data = await response.json();
					setErrMsg(data.message || "Something went wrong.");
				}
			} catch (error) {
				setErrMsg(error.message);
			}
		} else {
			if (password !== confirmPassword) {
				setErrMsg("Passwords do not match.");
				return;
			}
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/api/change-password`, {
					method: "PUT",
					headers: {
						'Content-Type': "application/json",
						'Authorization': "Bearer " + sessionStorage.getItem("token")
					},
					body: JSON.stringify({
						password: password,
					})
				});
				if (response.ok) {
					alert("Password successfully changed.");
					navigate('/');
				} else {
					const data = await response.json();
					setErrMsg(data.message || "Something went wrong.");
				}
			} catch (error) {
				setErrMsg(error.message);
			}
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div style={{ width: '100%', maxWidth: '1000px', margin: '30px auto', padding: '30px', backgroundColor: '#2b2a2a', borderRadius: '10px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', textAlign: 'center' }}>
				<div className="row justify-content-center">
					<div className="col-md-6 pb-5 text-light authDiv" >
						<div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 50px rgba(255, 255, 255, 0.2)', border: '1px solid white' }}>
							<h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
								{!hasToken ? "Reset Password" : "Change Password"}
							</h2>
							{!hasToken ? (
								<div style={{ marginBottom: '20px' }}>
									<input
										type="email"
										style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
										placeholder="Email"
										onChange={handleEmailChange}
										required
									/>
								</div>
							) : (
								<>
									<div style={{ marginBottom: '20px' }}>
										<input
											type="password"
											style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
											placeholder="New Password"
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
									<div style={{ marginBottom: '20px' }}>
										<input
											type="password"
											style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
											placeholder="Confirm New Password"
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
										/>
									</div>
								</>
							)}
							{error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
							<div style={{ textAlign: 'center' }}>
								<button
									type="submit"
									style={{
										backgroundColor: '#6c757d',
										marginBottom: '10px',
										color: '#fff',
										border: 'none',
										borderRadius: '5px',
										padding: '10px 20px',
										cursor: 'pointer',
										boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
										transition: 'box-shadow 0.3s ease',
										outline: 'none',
									}}
								>
									Submit
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};
