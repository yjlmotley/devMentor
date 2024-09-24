import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const MentorSessionBoard = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		actions.getAllSessionRequests()
	}, [])

	const formatSchedule = (day, schedule) => {
		if (schedule && schedule[day] && schedule[day].start && schedule[day].end) {
			return `${schedule[day].start} - ${schedule[day].end}`;
		}
		return "Not available";
	};

	return (
		<div className="container">
			<h2>TBD: MENTOR SESSION BOARD</h2>
			<ul class="list-group">
				{store.sessionRequests.map((request, index) => {
					return (
						<li class="list-group-item">
							<div key={request.id} className="col-md-4 mb-3">
								<div className="card h-100">
									<div className="card-body">
										<h5 className="card-title">{request.title}</h5>
										<p className="card-text">{request.details}</p>
										<h6>Skills:</h6>
										<ul>
											{request.skills.map((skill, index) => (
												<li key={index}>{skill}</li>
											))}
										</ul>
										<h6>Schedule:</h6>
										<p>Monday: {formatSchedule('monday', request.schedule)}</p>
										<p>Saturday: {formatSchedule('saturday', request.schedule)}</p>
										<p>Wednesday: {formatSchedule('wednesday', request.schedule)}</p>
									</div>
									<div className="card-footer">
										<small className="text-muted">Created at: {new Date(request.time_created).toLocaleString()}</small>
										<Link to="/">
											<button className="btn btn-primary">Submit Bid</button>
										</Link>
									</div>
								</div>
							</div>
						</li>
					)
				})}


			</ul>
			<br />
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};
