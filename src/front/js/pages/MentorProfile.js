import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";


import { Context } from "../store/appContext";

export const MentorProfile = () => {
	const { store, actions } = useContext(Context);
	const [mentors, setMentors] = useState({
		email: store.mentors?.email || '',
		first_name: store.mentors?.first_name || '',
		last_name: store.mentors?.last_name || '',
		nick_name: store.mentors?.nick_name || '',
		phone: store.mentors?.phone || '',
		city: store.mentors?.city || '',
		what_state: store.mentors?.what_state || '',
		country: store.mentors?.country || '',
		years_exp: store.mentors?.years_exp || '',
		skills: store.mentors?.skills || '',
		past_sessions: store.mentors?.past_sessions || '',
		days: store.mentors?.days || '',
		price: store.mentors?.price || '',
		about_me: store.mentors?.about_me || '',
	});

	const handleEdit = (e) => {
		const { name, value } = e.target;
		setMentors({
			...mentors,
			[name]: value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await actions.editMentor(mentors);
		if (success) {
			alert('Mentor information updated sucessfully')
		} else {
			alert('Failed to update mentor information')
		}
	}

	return (
		<div className="container">
			<h2>TBD: MENTOR PROFILE</h2>

			<form onSubmit={handleSubmit}>
				{Object.keys(mentors).map((key, index) => (
					<div className="form-group" key={index}>
						<label htmlFor={key}>
							{key.replace('_', ' ').toUpperCase()}
						</label>
						<input
							type="text"
							className="form-control"
							id={key}
							name={key}
							value={mentors[key]}
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