import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { skillsList } from "../store/data";



export const CreateSession = () => {
	const [title, setTitle] = useState("");
	const [details, setDetails] = useState("");
	const [selectedSkills, setSelectedSkills] = useState([]);


	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Form submitted:", { title, details, selectedSkills });
		// Handle form submission logic here
	};


	const handleSelectChange = (selectedOptions, { name }) => {
		const values = selectedOptions ? selectedOptions.map(option => option.label) : [];
		setSelectedSkills(values); // Set selectedSkills to an array of labels
	};

	return (
		<div className="container">
			<h1>Create Mentor Session</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						type="text"
						className="form-control"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="details" className="form-label">
						Details
					</label>
					<textarea
						className="form-control"
						id="details"
						rows="5"
						value={details}
						onChange={(e) => setDetails(e.target.value)}
						required
					></textarea>
				</div>
				<div className="mb-3">
					<label htmlFor="skills" className="form-label">
						Skills
					</label>
					<CreatableSelect
						isMulti
						name="skills"
						classNamePrefix="select"
						value={selectedSkills.map(skill => ({ value: skill, label: skill }))}
						onChange={handleSelectChange}
						options={skillsList}
					/>


				</div>
				<div>
					<div class="day-container">
						<label for="monday">Monday:</label>
						<input type="text" id="mondayStart" name="mondayStart" /> to
						<input type="text" id="mondayEnd" name="mondayEnd" />
					</div>
					<div class="day-container">
						<label for="tuesday">Tuesday:</label>
						<input type="time" id="tuesdayStart" name="tuesdayStart" /> to
						<input type="time" id="tuesdayEnd" name="tuesdayEnd" />
					</div>
					<div class="day-container">
						<label for="wednesday">Wednesday:</label>
						<input type="time" id="wednesdayStart" name="wednesdayStart" /> to
						<input type="time" id="wednesdayEnd" name="wednesdayEnd" />
					</div>
					<div class="day-container">
						<label for="thursday">Thursday:</label>
						<input type="time" id="thursdayStart" name="thursdayStart" /> to
						<input type="time" id="thursdayEnd" name="thursdayEnd" />
					</div>
					<div class="day-container">
						<label for="friday">Friday:</label>
						<input type="time" id="fridayStart" name="fridayStart" /> to
						<input type="time" id="fridayEnd" name="fridayEnd" />
					</div>
					<div class="day-container">
						<label for="saturday">Saturday:</label>
						<input type="time" id="saturdayStart" name="saturdayStart" /> to
						<input type="time" id="saturdayEnd" name="saturdayEnd" />
					</div>
					<div class="day-container">
						<label for="sunday">Sunday:</label>
						<input type="time" id="sundayStart" name="sundayStart" /> to
						<input type="time" id="sundayEnd" name="sundayEnd" />
					</div>
				</div>
				<button type="submit" className="btn btn-primary">
					Create Session
				</button>
			</form>
		</div>
	);
};

export default CreateSession;
