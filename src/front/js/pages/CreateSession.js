import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { skillsList } from "../store/data";



export const CreateSession = () => {
	const [title, setTitle] = useState("");
	const [details, setDetails] = useState("");
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [hours_needed, setHours_needed] = useState("");
	const [days, setDays] = useState([]);


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
				<div className="container mt-4">
					<form onSubmit={handleSubmit}>
						{Object.keys(formState).map((day) => (
							<div className="form-group row" key={day}>
								<div className="col-md-2">
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											id={`${day}Checkbox`}
											checked={formState[day].checked}
											onChange={() => handleCheckboxChange(day)}
										/>
										<label className="form-check-label" htmlFor={`${day}Checkbox`}>
											{day.charAt(0).toUpperCase() + day.slice(1)}:
										</label>
									</div>
								</div>
								<div className="col-md-4">
									<input
										type="time"
										className="form-control"
										id={`${day}Start`}
										name={`${day}Start`}
										value={formState[day].start}
										onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
										disabled={!formState[day].checked}
									/>
								</div>
								<div className="col-md-4">
									<input
										type="time"
										className="form-control"
										id={`${day}End`}
										name={`${day}End`}
										value={formState[day].end}
										onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
										disabled={!formState[day].checked}
									/>
								</div>
							</div>
						))}
						<button type="submit" className="btn btn-primary">
							Submit
						</button>
					</form>
				</div>
				<button type="submit" className="btn btn-primary">
					Create Session
				</button>
			</form>
		</div>
	);
};

export default CreateSession;
