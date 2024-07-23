import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { arrayOf } from "prop-types";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { skillsList, daysOfTheWeek, stateOptions, countryOptions } from "../store/data";
import { ValidatePrice, ValidateNumber, ValidatePhoneNumber } from "../component/Validators";


import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { parsePhoneNumber, AsYouType } from 'libphonenumber-js';

import "../../styles/mentorProfile.css";
import { useAsync } from "react-select/async";


export const MentorProfile = () => {
	const { store, actions } = useContext(Context);
	const [editMode, setEditMode] = useState(false);
	const [originalMentor, setOriginalMentor] = useState({});
	const [invalidItems, setInvalidItems] = useState([]);
	const [ phoneError, setPhoneError ] = useState('');
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

	// const [loading, setLoading] = useState(true);
	// if (loading) {
	// 	return <div>Loading...</div>;
	// }
	// if (!mentor) {
	// 	return <div>Mentor not found</div>;
	// }

	const handleCancelChanges = () => {
		setMentor(originalMentor);
		setEditMode(false);
	};

	const [ CharacterCount, setCharacterCount ] = useState(0);
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
		if (name === "about_me") {
			setCharacterCount(value.length);
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
			what_state: selectedOption ? selectedOption.value : '',
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
		setInvalidItems([]);
		let isPriceValid = ValidatePrice(mentor.price, setInvalidItems);
		let isYearValid = ValidateNumber(mentor.years_exp, setInvalidItems);
		const phoneValidation = ValidatePhoneNumber(mentor.phone, selectedCountry);
		if (isPriceValid && isYearValid && phoneValidation.isValid) {
			const success = await actions.editMentor(mentor);
			if (success) {
				alert('Mentor information updated sucessfully')
				setEditMode(false)
			} else {
				alert('Failed to update mentor information')
			}
		} else {
			if (!phoneValidation.isValid) {
				setPhoneError(phoneValidation.message);
			}
			console.log("Invalid inputs:", invalidItems);
			console.log(mentor.phone);
		}
	};

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


	const [ selectedCountry, setSelectedCountry ] = useState();

	const handlePhoneChange = (value, countryData) => {
		const phoneValidation = ValidatePhoneNumber(value, countryData.countryCode);
		setSelectedCountry(countryData.countryCode);
		if (phoneValidation.isValid) {
			setPhoneError('');
		} else {
			setPhoneError(phoneValidation.message);
		}
		console.log(value);
		setMentor(prevMentorInfo => ({
			...prevMentorInfo,
			phone: value
		}));
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
			.then(data => {
				setMentor(data);
				setOriginalMentor(data);
			})
			// .then(() => { setLoading(false) })
			.catch(error => console.log(error))
	}, []);

	

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
								<input type="email" name="email" value={mentor.email} onChange={handleChange} className="form-control" disabled />
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
								<>
									<PhoneInput
										country={'us'}
										value={mentor.phone}
										onChange={handlePhoneChange}
										inputClass="form-control"
										inputStyle={{
											width: '100%'
										}}
										inputProps={{
											name: 'phone',
											required: true,
											autoFocus: true
										}}
									/>
									{phoneError && <div className="text-danger">{phoneError}</div>}
								</>
							) : (
								// mentor.phone && formatPhoneNumber(`+${mentor.phone}`)
								<PhoneInput
									disabled
									country={'us'}
									value={mentor.phone}
									onChange={handlePhoneChange}
									inputClass="form-control disabled border-0"
									inputStyle={{
										height: '25px',
										fontSize: '14px',
										padding: '0px',
										margin: '0px',
										lineHeight: 'auto',
										width: '100%'
									}}
									buttonStyle={{
										display: 'none'
									}}
								/>
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
									options={mentor.country === "United States of America (USA)" ? stateOptions : []}
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
							{invalidItems.includes("years_exp") &&
								<label className="error-label alert alert-danger" role="alert" style={{
									padding: '0.5rem',
									fontSize: '0.875rem',
									lineHeight: '1.2',
									width: '100%',
									marginTop: '0.25rem',
									marginBottom: '0'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Danger:" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor' }}>
										<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
									</svg>
									Must be a number (ex. 2)
								</label>}
						</dd>

						<dt className="col-sm-4">Skills:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<CreatableSelect
									isMulti
									name="skills"
									value={mentor.skills.map(skill => ({ value: skill, label: skill }))}
									onChange={handleSelectChange}
									options={skillsList.filter(skill => !mentor.skills.includes(skill.label))}
									closeMenuOnSelect={false}
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
									options={daysOfTheWeek.filter(day => !mentor.days.includes(day.label))}
									className="basic-multi-select"
									classNamePrefix="select"
									closeMenuOnSelect={false}
									defaultValue={mentor.days.map(day => ({ value: day, label: day }))}
									onChange={handleSelectChange}
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
										type="text"
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
							{invalidItems.includes("price") &&
								<label className="error-label alert alert-danger" role="alert" style={{
									padding: '0.5rem',
									fontSize: '0.875rem',
									lineHeight: '1.2',
									width: '100%',
									marginTop: '0.25rem',
									marginBottom: '0'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Danger:" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor' }}>
										<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
									</svg>
									Invalid price value (ex. 20.00)
								</label>}
						</dd>

						<dt className="col-sm-4">About Me:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<>
									<textarea name="about_me" value={mentor.about_me} onChange={handleChange} className="form-control" rows=""></textarea>
									{CharacterCount}
								</>
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
			{editMode ? (
				<button onClick={handleCancelChanges}>Cancel Changes</button>
			) : ''}
			{editMode ? (<button onClick={(e) => { handleSubmit(e) }}>Save Changes</button>) : ''}
			{mentor.is_active ? (
				<button onClick={handleDeactivate}>Deactivate Account</button>
			) : (
				<button onClick={handleReactivate}>Reactivate Account</button>
			)}
		</div>
	);
};