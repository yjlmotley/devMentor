import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const MentorProfile = () => {
	const { store, actions } = useContext(Context);
	const [editMode, setEditMode] = useState(false);
	const [mentor, setMentor] = useState({
		email: '',
		is_active: true,
		first_name: '',
		last_name: '',
		nick_name: '',
		phone: '',
		city: '',
		what_state: '',
		country: '',
		years_exp: '',
		skills: [],
		days: [],
		price: '',
		about_me: '',
	});

	const handleChange = (e) => {
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
			setEditMode(false)
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
		setMentor((prevMentor) => ({ ...prevMentor, is_active: false }));
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
			.then(() => { setLoading(false) })
			.catch(error => console.log(error))
	}, []);


	const [loading, setLoading] = useState(true);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!mentor) {
		return <div>Mentor not found</div>;
	}

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Mentor Profile</h2>
			{editMode == false ? (<button onClick={() => setEditMode(true)}>Edit Profile</button>) : ''}
			<div className="row">
				<div className="col-md-4 mb-4">
					{mentor.profile_photo && (
						<img src={mentor.profile_photo.url} alt="Profile" className="img-fluid rounded" />
					)}
				</div>
				<div className="col-md-8">
					<dl className="row">
						<dt className="col-sm-4">Email:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="email" name="email" value={mentor.email} onChange={handleChange} className="form-control" />
							) : (
								mentor.email
							)}
						</dd>

						<dt className="col-sm-4">First Name:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="first_name" value={mentor.first_name} onChange={handleChange} className="form-control" />
							) : (
								mentor.first_name
							)}
						</dd>

						<dt className="col-sm-4">Last Name:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="last_name" value={mentor.last_name} onChange={handleChange} className="form-control" />
							) : (
								mentor.last_name
							)}
						</dd>

						<dt className="col-sm-4">Nickname:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="nick_name" value={mentor.nick_name} onChange={handleChange} className="form-control" />
							) : (
								mentor.nick_name
							)}
						</dd>

						<dt className="col-sm-4">Phone:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="phone" value={mentor.phone} onChange={handleChange} className="form-control" />
							) : (
								mentor.phone
							)}
						</dd>

						<dt className="col-sm-4">City:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="city" value={mentor.city} onChange={handleChange} className="form-control" />
							) : (
								mentor.city
							)}
						</dd>

						<dt className="col-sm-4">State:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="what_state" value={mentor.what_state} onChange={handleChange} className="form-control" />
							) : (
								mentor.what_state
							)}
						</dd>

						<dt className="col-sm-4">Country:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="country" value={mentor.country} onChange={handleChange} className="form-control" />
							) : (
								mentor.country
							)}
						</dd>

						<dt className="col-sm-4">Years of Experience:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="years_exp" value={mentor.years_exp} onChange={handleChange} className="form-control" />
							) : (
								mentor.years_exp
							)}
						</dd>

						<dt className="col-sm-4">Skills:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="skills" value={mentor.skills.join(", ")} onChange={handleChange} className="form-control" />
							) : (
								mentor.skills.join(", ")
							)}
						</dd>

						<dt className="col-sm-4">Days Available:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="text" name="days" value={mentor.days.join(", ")} onChange={handleChange} className="form-control" />
							) : (
								mentor.days.join(", ")
							)}
						</dd>

						<dt className="col-sm-4">Price:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<input type="number" name="price" value={mentor.price} onChange={handleChange} className="form-control" />
							) : (
								mentor.price
							)}
						</dd>

						<dt className="col-sm-4">About Me:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<textarea name="about_me" value={mentor.about_me} onChange={handleChange} className="form-control"></textarea>
							) : (
								mentor.about_me
							)}
						</dd>
					</dl>
				</div>
			</div>

			{/* {mentor.portfolio_photos && mentor.portfolio_photos.length > 0 && (
				<div className="mt-4">
					<h4>Portfolio Photos</h4>
					<div className="row">
						{mentor.portfolio_photos.map((photo, index) => (
							<div key={index} className="col-md-3 mb-4">
								<img src={photo.url} alt={`Portfolio ${index}`} className="img-fluid rounded" />
							</div>
						))}
					</div>
				</div>
			)} */}
			{editMode ? (<button onClick={(e) => { handleSubmit(e) }}>Save Changes</button>) : ''}
			<button onClick={handleDeactivate}>Deactivate Account</button>
		</div>
	);
};