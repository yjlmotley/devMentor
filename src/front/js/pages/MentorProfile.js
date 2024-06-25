import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const MentorProfile = () => {
	const { store, actions } = useContext(Context);
	const [mentor, setMentor] = useState({
		email: '',
		first_name: '',
		last_name: '',
		nick_name: '',
		phone: '',
		city: '',
		what_state: '',
		country: '',
		years_exp: '',
		skills: '',
		past_sessions: '',
		days: '',
		price: '',
		about_me: '',
	});

	const handleEdit = (e) => {
		const { name, value } = e.target;
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await actions.editMentor(mentor);
		if (success) {
			alert('Mentor information updated sucessfully')
		} else {
			alert('Failed to update mentor information')
		}
	}

	const handleDeactivate = async () => {
		const token = sessionStorage.getItem('token');
		console.log(sessionStorage.getItem('token'));
		if (!token) {
			alert('No token found');
			return
		}
		const response = await fetch(process.env.BACKEND_URL + "/api/mentor/deactivate", {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			alert('Account deactivated succesfully')
		} else {
			alert('Failed to deactivate account')
		}
	}

	useEffect(() => {
		fetch(process.env.BACKEND_URL + "/api/mentor", {
			headers: { Authorization: "Bearer " + sessionStorage.getItem("token") }
		})
			.then(resp => resp.json())
			.then(data => setMentor(data))
	}, []);


	return (
		<div className="container">
			<h2>TBD: MENTOR PROFILE</h2>
			<button onClick={handleDeactivate}>Deactivate Account</button>

			<form onSubmit={handleSubmit}>
				{Object.keys(mentor).map((key, index) => (
					<div className="form-group" key={index}>
						<label htmlFor={key}>
							{key.replace('_', ' ').toUpperCase()}
						</label>
						<input
							type="text"
							className="form-control"
							id={key}
							name={key}
							value={mentor[key] ? mentor[key] : ""}
							placeholder={"Specify your " + key}
							onChange={handleEdit}
						/>

					</div>
				))}
				<button type="submit" className="btn btn-primary">Edit mentor profile</button>

			</form>


			<br />
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};