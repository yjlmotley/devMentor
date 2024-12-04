import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { ValidatePrice, ValidateNumber, ValidatePhoneNumber, ValidateFirstName, ValidateLastName } from "../component/Validators";
import { skillsList, daysOfTheWeek, stateOptions, countryOptions } from "../store/data";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import "../../styles/mentorProfile.css";

import ProfilePhoto from "../component/ProfilePhoto";
import PortfolioImage from "../component/PortfolioImage";
import { ChangePsModal } from "../auth/ChangePsModal";


export const MentorProfile = () => {
	const { actions } = useContext(Context);
	const [showChangePsModal, setShowChangePsModal] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [originalMentor, setOriginalMentor] = useState({});
	const [selectedCountry, setSelectedCountry] = useState();
	const [invalidItems, setInvalidItems] = useState([]);
	const [phoneError, setPhoneError] = useState('');
	const [CharacterCount, setCharacterCount] = useState(0);
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

	const placeholderImage = 'https://res.cloudinary.com/dufs8hbca/image/upload/v1730340260/Saved/PlaceholderImg_augxly.png'; // Path to your placeholder image
	const placeholderImages = ['https://res.cloudinary.com/dufs8hbca/image/upload/v1730340260/Saved/PlaceholderImg_augxly.png', 'https://res.cloudinary.com/dufs8hbca/image/upload/v1730340260/Saved/PlaceholderImg_augxly.png', 'https://res.cloudinary.com/dufs8hbca/image/upload/v1730340260/Saved/PlaceholderImg_augxly.png', 'https://res.cloudinary.com/dufs8hbca/image/upload/v1730340260/Saved/PlaceholderImg_augxly.png']
	const profileImageUrl = mentor.profile_photo?.image_url || placeholderImage;
	const portfolioImageUrls = mentor?.portfolio_photos?.length > 0 ? mentor.portfolio_photos : placeholderImages;

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

	const handleCountryChange = (selectedOption) => {
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			country: selectedOption ? selectedOption.label : '',
		}));
	};

	const handleStateChange = (selectedOption) => {
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			what_state: selectedOption ? selectedOption.value : '',
		}));
	};

	const handlePriceChange = (event) => {
		const { value } = event.target;
		setMentor((prevMentorInfo) => ({
			...prevMentorInfo,
			price: value.trim() === "" ? null : value,
		}));
	}


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

	const handleShowChangePsModal = () => {
		setShowChangePsModal(true);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (mentor.price === "None") {
			setMentor((prevMentorInfo) => ({
				...prevMentorInfo,
				price: null,
			}));
			return;
		}
		setInvalidItems([]);
		let isPriceValid = ValidatePrice(mentor.price, setInvalidItems, setMentor);
		let isYearValid = ValidateNumber(mentor.years_exp, setInvalidItems);
		let isFirstNameValid = ValidateFirstName(mentor.first_name, setInvalidItems)
		let isLastNameValid = ValidateLastName(mentor.last_name, setInvalidItems)

		if (isPriceValid && isYearValid && isFirstNameValid && isLastNameValid) {
			const success = await actions.editMentor(mentor);
			if (success) {
				alert('Mentor information updated sucessfully')
				setEditMode(false)
			} else {
				alert('Failed to update mentor information')
			}
		}
	};


	return (

		<div className="container card  border-secondary shadow border-2 px-0 mt-5">
			<div id="header" className="card-header bg-light-subtle mb-5">
				<h2 className="mb-4 text-center">
					Mentor Profile
					{editMode == false
						? (<button onClick={() => setEditMode(true)} className="btn btn-secondary fa-solid fa-pencil ms-4"></button>)
						: ''
					}
				</h2>
				{!mentor.is_active && (
					<div className="alert alert-warning" role="alert">
						Your account is currently deactivated, please reactivate your account if you would like to continue to offer your services.
					</div>
				)}
			</div>



			<div className="row">
				<div className="col-7 mb-4">
					<div className=" ps-5">
						<div className=" ps-5">
							<div className="dflex ps-5">
								<ProfilePhoto  url={profileImageUrl} setMentor={setMentor} editMode={editMode} />
							</div>
						</div>
					</div>
					
					<PortfolioImage portfolioImgs={portfolioImageUrls} setMentor={setMentor} editMode={editMode} />
				</div>
				<div className="col-5" style={{ marginTop: "50px" }}>
					{editMode &&
						<>
							<button onClick={handleCancelChanges}>Cancel Changes</button>
							<button onClick={(e) => { handleSubmit(e) }}>Save Changes</button>
						</>
					}
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
								<>
									<input type="text" name="first_name" value={mentor.first_name} onChange={handleChange} className="form-control" />
									{invalidItems.includes("first_name") && <label className="error-label">First Name is required</label>}
								</>
							) : (
								mentor.first_name
							)}

						</dd>

						<dt className="col-sm-4">Last Name:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<>
									<input type="text" name="last_name" value={mentor.last_name} onChange={handleChange} className="form-control" />
									{invalidItems.includes("last_name") && <label className="error-label">Last Name is required</label>}
								</>
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
								// TODO: If extra time: change the font of the phone input disabled number so it matches the rest of the font text on the page
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
									value={mentor.skills?.map(skill => ({ value: skill, label: skill }))}
									onChange={handleSelectChange}
									options={skillsList.filter(skill => !mentor.skills?.includes(skill.label))}
									closeMenuOnSelect={false}
								// styles={customStyles}
								/>
							) : (
								mentor.skills?.join(", ")
							)}
						</dd>

						<dt className="col-sm-4">Days Available:</dt>
						<dd className="col-sm-8">
							{editMode ? (
								<Select
									isMulti
									name="days"
									options={daysOfTheWeek.filter(day => !mentor.days?.includes(day.label))}
									className="basic-multi-select"
									classNamePrefix="select"
									closeMenuOnSelect={false}
									defaultValue={mentor.days?.map(day => ({ value: day, label: day }))}
									onChange={handleSelectChange}
								/>
							) : (
								mentor.days?.join(", ")
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
										value={mentor.price || null}
										onChange={handlePriceChange}
										// TODO: After signing up, the default value of price goes to "" which then the input changes to None.
										// The first time you hit send, it'll give you an error then change it to null, then the next time it pushes thru
										// Figure out a better situation for this
										className="form-control"
									/>
									<span className="input-group-text">/hr</span>
								</div>
							) : (
								mentor.price && mentor.price !== "None" ? `$${mentor.price} /hr` : ''
							)}
							{/* TODO: Make sure the invalideItems errors go away/reset if you hit 'cancel changes' button */}
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
									<textarea name="about_me" value={mentor.about_me} onChange={handleChange} className="form-control" rows="4"></textarea>
									<p className={CharacterCount > 2500 ? "text-danger" : ''} >{CharacterCount}</p>
								</>
							) : (
								mentor.about_me
							)}
						</dd>
					</dl>
					<button
						className="btn btn-light"
						onClick={handleShowChangePsModal}
					>
						Change Password
					</button>
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

			<div className="d-flex justify-content-center gap-3">
				{mentor.is_active ? (
					<button onClick={handleDeactivate}>Deactivate Account</button>
				) : (
					<button onClick={handleReactivate}>Reactivate Account</button>
				)}
			</div>

			{showChangePsModal && (
				<ChangePsModal
					show={showChangePsModal}
					onHide={() => setShowChangePsModal(false)}
				/>
			)}
		</div>
	);
};