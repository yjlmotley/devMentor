import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/MentorSessionBoard.css";

export const MentorSessionBoard = () => {
	const { store, actions } = useContext(Context);
	const [activeTab, setActiveTab] = useState('all');

	useEffect(() => {
		actions.getAllSessionRequests();
	}, []);

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
										<Link to="/" className="btn btn-primary btn-sm">Submit Bid</Link>
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
