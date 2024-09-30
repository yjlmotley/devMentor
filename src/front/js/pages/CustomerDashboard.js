import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import { Link } from "react-router-dom";
import "../../styles/customerDashboard.css";

export const CustomerDashboard = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		console.log("Fetching customer sessions on mount")
		actions.getCustomerSessions()
	}, []);

	const acceptedSessions = store.customerSessions.filter(session => session.mentor_id != null);
	const openSessions = store.customerSessions.filter(session => session.mentor_id == null && session.is_active);
	const pastSessions = store.customerSessions.filter(session => session.is_completed);

	return (
		<div className="sessions-dashboard">
			<h1 className="text-center mt-5">Your Sessions</h1>
			{/* This should only show if a mentor.id exists and or is not null */}
			<h2>Accepted sessions</h2>
			<div className="open-sessions">
				{acceptedSessions.map((session) => (
					<div key={session.id} className="session-card">
						<img variant="top" src="https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg" alt="https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg" />
						<div className="sessionBody">
							<div className="sessionTitle">{session.title}</div>
							<div className="sessionDescription">{session.description}</div>
						</div>
					</div>
				))}
			</div>
			{/* This should only show if a mentor.id doesnt exist and is_active is true */}
			<h2>Open Sessions</h2>
			<table className="striped bordered hover" >
				<thead>
					<tr>
						<th>Title</th>
						<th>Description</th>
						<th>Skills</th>
						<th>Focus Areas</th>
						<th>Resource Link</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{openSessions.map((session) => (
						<tr key={session.id}>
							<td>{session.title}</td>
							<td>{session.description}</td>
							<td>{session.skills.join(', ')}</td>
							<td>{session.focus_areas.join(', ')}</td>
							<td>
								<a href={session.resourceLink.startsWith('http') ? session.resourceLink : `https://${session.resourceLink}`}>
									{session.resourceLink}
								</a>
							</td>
							<td>
								<Link to="/" className="btn btn-primary btn-sm">Edit</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* This should only show if is_completed is true */}
			<h2>Past Sessions</h2>
			<table className="striped bordered hover" >
				<thead>
					<tr>
						<th>Title</th>
						<th>Description</th>
						<th>Skills</th>
						<th>Focus Areas</th>
						<th>Resource Link</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{pastSessions.map((session) => (
						<tr key={session.id}>
							<td>{session.title}</td>
							<td>{session.description}</td>
							<td>{session.skills.join(', ')}</td>
							<td>{session.focus_areas.join(', ')}</td>
							<td>
								<a href={session.resourceLink.startsWith('http') ? session.resourceLink : `https://${session.resourceLink}`}>
									{session.resourceLink}
								</a>
							</td>
							<td>
								<Link to="/" className="btn btn-primary btn-sm">Edit</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
