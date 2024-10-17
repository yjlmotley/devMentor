import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/customerDashboard.css";

export const CustomerDashboard = () => {
	const { store, actions } = useContext(Context);
	const [messageInputs, setMessageInputs] = useState({});

	useEffect(() => {
		console.log("Fetching customer sessions on mount");
		actions.getCustomerSessions();
	}, []);

	const acceptedSessions = store.customerSessions.filter(session => session.mentor_id != null);
	const openSessions = store.customerSessions.filter(session => session.mentor_id == null && session.is_active);
	const pastSessions = store.customerSessions.filter(session => session.is_completed);

	const handleMessageInputChange = (sessionId, mentorId, value) => {
		setMessageInputs(prevInputs => ({
			...prevInputs,
			[`${sessionId}-${mentorId}`]: value
		}));
	};

	const handleMessageReply = async (sessionId, mentorId) => {
		const message = messageInputs[`${sessionId}-${mentorId}`];
		if (message && message.trim()) {
			const success = await actions.sendMessageCustomer(sessionId, message, mentorId);
			if (success) {
				setMessageInputs(prevInputs => ({
					...prevInputs,
					[`${sessionId}-${mentorId}`]: ''
				}));
				actions.getCustomerSessions();
			}
		}
	};

	let handleDeleteSession = async (sessionId) => {
		let success = await actions.deleteSessionById(sessionId)
		if (success) {
			actions.getCustomerSessions();
		}
	};

	const handleConfirmMentor = async (sessionId, mentorId) => {
		const success = await actions.confirmMentorForSession(sessionId, mentorId);
		if (success) {
			console.log("Mentor confirmed successfully");
			actions.getCustomerSessions(); // Refresh the sessions
		} else {
			console.error("Failed to confirm mentor");
			// You might want to show an error message to the user here
		}
	};

	const renderSessionMessages = (session) => {
		const groupedMessages = session.messages ? session.messages.reduce((acc, msg) => {
			const mentorId = msg.mentor_id;
			if (!acc[mentorId]) {
				acc[mentorId] = [];
			}
			acc[mentorId].push(msg);
			return acc;
		}, {}) : {};

		const mentors = Object.keys(groupedMessages);

		return (
			<tr key={`${session.id}-messages`}>
				<td colSpan="6">
					<div className="accordion accordion-flush" id={`accordionFlush${session.id}`}>
						<div className="accordion-item">
							<h2 className="accordion-header">
								<button
									className="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target={`#flush-collapse${session.id}`}
									aria-expanded="false"
									aria-controls={`flush-collapse${session.id}`}
								>
									Messages for this session ({mentors.length} mentor{mentors.length !== 1 ? 's' : ''})
								</button>
							</h2>
							<div
								id={`flush-collapse${session.id}`}
								className="accordion-collapse collapse"
								data-bs-parent={`#accordionFlush${session.id}`}
							>
								<div className="accordion-body">
									{mentors.length > 0 ? (
										<div className="accordion" id={`mentorAccordion${session.id}`}>
											{mentors.map((mentorId, index) => {
												const mentorMessages = groupedMessages[mentorId] || [];
												const allMessages = mentorMessages.sort((a, b) => new Date(a.time_created) - new Date(b.time_created));

												return (
													<div className="accordion-item" key={`${session.id}-${mentorId}`}>
														<h2 className="accordion-header">
															<button
																className="accordion-button collapsed"
																type="button"
																data-bs-toggle="collapse"
																data-bs-target={`#mentor-collapse-${session.id}-${mentorId}`}
																aria-expanded="false"
																aria-controls={`mentor-collapse-${session.id}-${mentorId}`}
															>
																Mentor {allMessages[0]?.mentor_name || `#${index + 1}`} ({allMessages.length} message{allMessages.length !== 1 ? 's' : ''})
															</button>


														</h2>
														<div
															id={`mentor-collapse-${session.id}-${mentorId}`}
															className="accordion-collapse collapse"
															data-bs-parent={`#mentorAccordion${session.id}`}
														>
															<div className="accordion-body">
																{allMessages.map((msg) => (
																	<div key={msg.id} className="message-row">
																		<strong>{msg.sender === "mentor" ? `Mentor ${msg.mentor_name}` : "You"}:</strong> {msg.text}
																		<p className="text-muted">{new Date(msg.time_created).toLocaleString()}</p>
																	</div>
																))}
															</div>
															<div>
																<textarea
																	className="form-control"
																	id={`textInput-${session.id}-${mentorId}`}
																	rows="5"
																	value={messageInputs[`${session.id}-${mentorId}`] || ''}
																	onChange={(e) => handleMessageInputChange(session.id, mentorId, e.target.value)}
																	onKeyDown={(e) => {
																		if (e.key === 'Enter' && !e.shiftKey) {
																			e.preventDefault();
																			handleMessageReply(session.id, mentorId);
																		}
																	}}
																	placeholder={`Type your message for Mentor ${allMessages[0]?.mentor_name || `#${mentorId}`} here...`}
																></textarea>
																<button
																	className="btn btn-primary mt-2"
																	onClick={() => handleMessageReply(session.id, mentorId)}
																>
																	Send to Mentor {allMessages[0]?.mentor_name || `#${mentorId}`}
																</button>
																<button
																	className="btn btn-success"
																	onClick={() => handleConfirmMentor(session.id, mentorId)}
																>
																	Confirm Mentor
																</button>

															</div>
														</div>
													</div>
												);
											})}
										</div>
									) : (
										<p>No messages for this session yet.</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</td>
			</tr>
		);
	};

	return (
		<div className="sessions-dashboard">
			<h1 className="text-center mt-5">Your Sessions</h1>
			<div>
				<h2>Accepted Sessions</h2>
				<div className="open-sessions">
					{acceptedSessions.map((session) => (
						<div key={session.id} className="session-card">
							<img variant="top" src="https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg" alt="Session" />
							<div className="container sessionBody">
								
									<div className="row align-items-center justify-content-center">
										<label className="col-auto"><strong>Session with:</strong></label>
										<div className="col-auto sessionTitle">
											<strong>{session.customer_name
												.split(' ')
												.map(word => word.charAt(0).toUpperCase() + word.slice(1))
												.join(' ')}</strong>
										</div>
									</div>
								
								<div className="text-center">
									<div className="sessionTitle"><h4>{session.title}</h4></div>
								</div>
								<div className="sessionDescription">{session.description}</div>
								<div className="sessionDescription">{session.duration}</div>
								<div className="sessionDescription">{session.totalHours}</div>

							</div>
						</div>
					))}
				</div>

				<h2>Open Sessions</h2>
				<table className="striped bordered hover">
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
							<React.Fragment key={session.id}>
								<tr>
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
										<Link to={`/edit-session/${session.id}`} className="btn btn-primary btn-sm">Edit</Link>
										<button className="btn btn-danger mt-2" onClick={() => handleDeleteSession(session.id)}>
											Delete Session
										</button>
									</td>
								</tr>
								{renderSessionMessages(session)}
							</React.Fragment>
						))}
					</tbody>
				</table>
				<h2>Past Sessions</h2>
				<table className="striped bordered hover">
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
							<React.Fragment key={session.id}>
								<tr>
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
								{renderSessionMessages(session)}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};