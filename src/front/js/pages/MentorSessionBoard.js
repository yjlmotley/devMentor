import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/MentorSessionBoard.css";

export const MentorSessionBoard = () => {
	const { store, actions } = useContext(Context);
	const [activeTab, setActiveTab] = useState('all');

	const [characterCount, setCharacterCount] = useState(0);
	const [ message, setMessage ] = useState("")

	useEffect(() => {
		actions.getAllSessionRequests();
	}, []);

	const handleMessage = (e) => {
        const value = e.target.value;
        if (value.length <= 2500) {
            setMessage(value);
            setCharacterCount(value.length);
        }
    };

	const formatTime = (minutes) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
	};

	const formatSchedule = (schedule) => {
		return Object.entries(schedule)
			.filter(([day, slot]) => slot.checked)
			.map(([day, slot]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${formatTime(slot.start)} - ${formatTime(slot.end)}`)
			.join(', ');
	};

	return (
		<div className="session-board-container">
			<div className="session-board card-custom">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h1 className="session-title">Sessions</h1>
					<div>
						<button className="btn btn-primary custom-create-btn">Create session</button>
						<button className="btn btn-link">
							<i className="bi bi-person-circle profile-icon"></i>
						</button>
					</div>
				</div>

				<ul className="nav nav-tabs mb-3 custom-nav-tabs">
					<li className="nav-item">
						<button
							className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
							onClick={() => setActiveTab('all')}
						>
							All
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
							onClick={() => setActiveTab('upcoming')}
						>
							Upcoming
						</button>
					</li>
				</ul>

				<div className="table-responsive">
					<table className="table table-hover custom-table">
						<thead>
							<tr>
								<th>Session</th>
								<th>Description</th>
								<th>Skills</th>
								<th>Schedule</th>
								<th>Created</th>
								<th>Focus areas</th>
								<th>Resource_link</th>
								<th>Actions</th>

							</tr>
						</thead>
						<tbody>
							{store.sessionRequests.map((session) => (
								<tr key={session.id}>
									<td>{session.title}</td>
									<td>{session.description}</td>
									<td>{session.skills.join(', ')}</td>
									<td>{formatSchedule(session.schedule)}</td>
									<td>{new Date(session.time_created).toLocaleDateString()}</td>
									<td>{session.focus_areas.join(', ')}</td>
									<td> <a href={session.resourceLink.startsWith('http') ? session.resourceLink : `https://${session.resourceLink}`}>
										{session.resourceLink}</a>
									</td>
									<td>
										<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#availabilityModal">
											Submit Availabilty
										</button>
										<div class="modal fade" id="availabilityModal" tabindex="-1" aria-labelledby="availabilityModalLabel" aria-hidden="true">
											<div class="modal-dialog">
												<div class="modal-content">
													<div class="modal-header">
														<h1 class="modal-title fs-5" id="availabilityModalLabel">Message Customer</h1>
														<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div class="modal-body">
														<textarea name="about_me" value={message} onChange={handleMessage} className="form-control" rows="4"></textarea>
														<p className={characterCount > 2500 ? "text-danger" : ''} >{characterCount}</p>
													</div>
													<div class="modal-footer">
														<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
														<button type="button" class="btn btn-primary">Save changes</button>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
