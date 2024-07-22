import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { arrayOf } from "prop-types";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { skillsList, daysOfTheWeek, stateOptions, countryOptions } from "../store/data";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { parsePhoneNumber } from 'libphonenumber-js';

import ProfilePhoto from "../component/ProfilePhoto";
import PortfolioImage from "../component/PortfolioImage";


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
	const placeholderImage = 'https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg'; // Path to your placeholder image
	const placeholderImages = ['https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg','https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg','https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg','https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg']
	const profileImageUrl = mentor.profile_photo?.image_url || placeholderImage;
	const portfolioImageUrls = mentor?.portfolio_photos?.length > 0? mentor.portfolio_photos : placeholderImages;

	const handleChange = (e) => {
		const { name, value } = e.target;
		let x = value
		if (name == "skills" || name == "days") {
			if (value.includes(",")) {
				x = value.split(",")
			} else {
				let array = []
				array.push(value)
				x = array
			}
		}
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			[name]: x
		}));
	};

	const handleSelectChange = (selectedOptions, { name }) => {
		const values = selectedOptions ? selectedOptions.map(option => option.label) : [];
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			[name]: values
		}));
	};

	const handleStateChange = (selectedOption) => {
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			what_state: selectedOption ? selectedOption.label : '',
		}));
	};

	const handleCountryChange = (selectedOption) => {
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			country: selectedOption ? selectedOption.label : '',
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

	const handleReactivate = async () => {
		const token = sessionStorage.getItem('token');
		if (!token) {
			alert('No token found');
			return;
		}
		setMentor((prevMentor) => ({ ...prevMentor, is_active: true }));
		const response = await fetch(process.env.BACKEND_URL + "/api/mentor/reactivate", {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			alert('Account reactivated successfully');
		} else {
			alert('Failed to reactivate account');
		}
	}

	const handlePhoneChange = (value) => {
		setMentor(prevMentorInfo => ({
			...prevMentorInfo,
			phone: value
		}));
	};

	const formatPhoneNumber = (phone) => {
		const phoneNumber = parsePhoneNumber(phone);
		return phoneNumber ? phoneNumber.formatInternational() : phone;
	};

	// const customStyles = {
	// 	option: (provided, state) => ({
	// 		...provided,
	// 		color: state.data.type === 'colour' ? 'blue' : 'green',
	// 	}),
	// 	multiValue: (provided, state) => ({
	// 		...provided,
	// 		backgroundColor: state.data.type === 'colour' ? 'lightblue' : 'lightgreen',
	// 	}),
	// };

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
			{!mentor.is_active && (
				<div className="alert alert-warning" role="alert">
					Your account is currently deactivated, please reactivate your account if you would like to continue to offer your services.
				</div>
			)}
			{editMode == false ? (<button onClick={() => setEditMode(true)}>Edit Profile</button>) : ''}
			<div className="row">
				<div className="col-6 mb-4">
					<ProfilePhoto url={profileImageUrl} setMentor={setMentor} />
				</div>
				<div className="col-6 mb-4">
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
								<PhoneInput
									country={'us'}
									value={mentor.phone}
									onChange={handlePhoneChange}
									inputClass="form-control"
								/>
							) : (
								formatPhoneNumber(`+${mentor.phone}`)
							)}
						</dd>

						<dt className="col-sm-4">Country:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<Select
									isClearable
									name="country"
									options={countryOptions}
									className="basic-single-select"
									classNamePrefix="select"
									onChange={handleCountryChange}
									defaultValue={countryOptions[195]}
									value={
										mentor.country
											? { value: mentor.country, label: mentor.country } : ''
									}
								/>
							) : (
								mentor.country
							)}
						</dd>

						<dt className="col-sm-4">Region/ State:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<CreatableSelect
									isClearable
									name="what_state"
									options={mentor.country === "United States of America" ? stateOptions : []}
									className="basic-single-select"
									classNamePrefix="select"
									onChange={handleStateChange}
									value={
										mentor.what_state
											? { value: mentor.what_state, label: mentor.what_state }
											: ''
									}
								/>
							) : (
								mentor.what_state
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
								<CreatableSelect
									isMulti
									name="skills"
									value={mentor.skills.map(skill => ({ value: skill, label: skill }))}
									onChange={handleSelectChange}
									options={skillsList}
									isDisabled={!editMode}
								// styles={customStyles}
								/>
							) : (
								mentor.skills.join(", ")
							)}
						</dd>

						<dt className="col-sm-4">Days Available:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<Select
									isMulti
									name="days"
									options={daysOfTheWeek}
									className="basic-multi-select"
									classNamePrefix="select"
									isDisable={!editMode}
								/>
							) : (
								mentor.days.join(", ")
							)}
						</dd>

						<dt className="col-sm-4">Price:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<div className="input-group">
									<span className="input-group-text">$</span>
									<input
										type="number"
										name="price"
										value={mentor.price || ''}
										onChange={handleChange}
										className="form-control"
									/>
									<span className="input-group-text">/hr</span>
								</div>
							) : (
								mentor.price ? `$${mentor.price} /hr` : ''
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
			{/* {editMode ? (<button onClick={(e) => setEditMode(false)}>Cancel Changes</button>) : ''} */}
			{editMode ? (<button onClick={(e) => { handleSubmit(e) }}>Save Changes</button>) : ''}
			{mentor.is_active ? (
				<button onClick={handleDeactivate}>Deactivate Account</button>
			) : (
				<button onClick={handleReactivate}>Reactivate Account</button>
			)}

			<div className="col-12 mb-4">
				<PortfolioImage portfolioImgs={portfolioImageUrls} setMentor={setMentor} />
			</div>
			
		</div>

		
	);
};