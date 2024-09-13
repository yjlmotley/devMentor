import React, { useState, useContext } from "react";
import CreatableSelect from "react-select/creatable";
import { skillsList } from "../store/data";
import { Context } from "../store/appContext";



export const CreateSessionLogic = () => {
	const { store, actions } = useContext(Context);

	const [title, setTitle] = useState("");
	const [details, setDetails] = useState("");
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [hours_needed, setHours_needed] = useState("");
	const [days, setDays] = useState([]);
	const [schedule, setSchedule] = useState({
		monday: { checked: false, start: "", end: "", hours_needed: 0 },
		tuesday: { checked: false, start: "", end: "", hours_needed: 0 },
		wednesday: { checked: false, start: "", end: "", hours_needed: 0 },
		thursday: { checked: false, start: "", end: "", hours_needed: 0 },
		friday: { checked: false, start: "", end: "", hours_needed: 0 },
		saturday: { checked: false, start: "", end: "", hours_needed: 0 },
		sunday: { checked: false, start: "", end: "", hours_needed: 0 },
	});


	const handleSubmit = async (event) => {
		event.preventDefault();

		// Transform schedule object to remove unchecked days
		const transformedSchedule = Object.entries(schedule).reduce((acc, [day, value]) => {
			if (value.checked) {
				acc[day] = { start: value.start, end: value.end, hours_needed: value.hours_needed };
			}
			return acc;
		}, {});

		console.log("Form submitted:", {
			title,
			details,
			skills: selectedSkills,
			schedule: transformedSchedule
		});

		const success = await actions.createSession({
			title: title,
			details: details,
			skills: selectedSkills,
			schedule: transformedSchedule
		});

		if (success) {
			// Reset form fields
			setTitle("");
			setDetails("");
			setSelectedSkills([]);
			setSchedule({
				monday: { checked: false, start: "", end: "", hours_needed: 0 },
				tuesday: { checked: false, start: "", end: "", hours_needed: 0 },
				wednesday: { checked: false, start: "", end: "", hours_needed: 0 },
				thursday: { checked: false, start: "", end: "", hours_needed: 0 },
				friday: { checked: false, start: "", end: "", hours_needed: 0 },
				saturday: { checked: false, start: "", end: "", hours_needed: 0 },
				sunday: { checked: false, start: "", end: "", hours_needed: 0 },
			});
		} else {
			alert("Something went wrong creating a Mentor Session.");
		}
	};


	const handleSelectChange = (selectedOptions) => {
		const values = selectedOptions ? selectedOptions.map(option => option.label) : [];
		setSelectedSkills(values);
	};

	const handleScheduleChange = (day, field, value) => {
		setSchedule(prevSchedule => ({
			...prevSchedule,
			[day]: { ...prevSchedule[day], [field]: field === 'checked' ? !prevSchedule[day].checked : value }
		}));
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
					{Object.entries(schedule).map(([day, value]) => (
						<div className="form-group row" key={day}>
							<div className="col-md-2">
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										id={`${day}Checkbox`}
										checked={value.checked}
										onChange={() => handleScheduleChange(day, 'checked')}
									/>
									<label className="form-check-label" htmlFor={`${day}Checkbox`}>
										{day.charAt(0).toUpperCase() + day.slice(1)}:
									</label>
								</div>
							</div>
							<div className="col-md-3">
								<input
									type="time"
									className="form-control"
									id={`${day}Start`}
									name={`${day}Start`}
									value={value.start}
									onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
									disabled={!value.checked}
								/>
							</div>
							<div className="col-md-3">
								<input
									type="time"
									className="form-control"
									id={`${day}End`}
									name={`${day}End`}
									value={value.end}
									onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
									disabled={!value.checked}
								/>
							</div>
							<div className="col-md-3">
								<input
									type="number"
									className="form-control"
									id={`${day}Hours`}
									name={`${day}Hours`}
									value={value.hours_needed}
									onChange={(e) => handleScheduleChange(day, 'hours_needed', parseInt(e.target.value))}
									disabled={!value.checked}
									placeholder="Hours needed"
								/>
							</div>
						</div>
					))}
				</div>
				<button type="submit" className="btn btn-primary">
					Create Session
				</button>
			</form>
		</div>
	);
};

export default CreateSessionLogic;
