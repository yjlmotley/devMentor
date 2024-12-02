import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/customerDashboard.css";
import { GoogleMeeting } from "../component/GoogleMeeting";
import { useNavigate } from "react-router-dom";

export const CustomerDashboard = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	const [messageInputs, setMessageInputs] = useState({});
	const [activeSessionId, setActiveSessionId] = useState(null);
	const [confirmModalData, setConfirmModalData] = useState({
		sessionId: null,
		mentorId: null,
		date: "",
		startTime: "",
		endTime: ""
	});

	// Token Check Auth or login
	useEffect(() => {
		actions.checkStorage();
		if (!store.token) {
			navigate("/customer-login")

		}
	}, [])

	// Fetch All Customer Sessions
	useEffect(() => {
		console.log("Fetching customer sessions on mount");
		actions.getCustomerSessions();

		// Parse URL parameters
		const params = new URLSearchParams(location.search);
		const auth = params.get('auth');
		const error = params.get('error');

		// If we have successful authentication and an active session ID
		if (auth === 'success' && activeSessionId) {
			// Use setTimeout to ensure the modal is available in the DOM
			setTimeout(() => {
				const modalElement = document.querySelector(`#GoogleMeetModal${activeSessionId}`);
				if (modalElement) {
					const bsModal = new bootstrap.Modal(modalElement);
					bsModal.show();
				}
			}, 500);
		} else if (error) {
			// Handle error case
			console.error("Authentication error:", error);
			// You might want to show an error message to the user
		}
	}, [location.search, activeSessionId]);

	// Set Active Session For Google Meet Customized
	useEffect(() => {
		const storedSessionId = localStorage.getItem('pendingMeetingSessionId');
		if (storedSessionId) {
			setActiveSessionId(storedSessionId);
			// Clear the stored sessionId
			localStorage.removeItem('pendingMeetingSessionId');
		}
	}, []);


	// Function to handle opening the Google Meet modal
	const handleGoogleMeetClick = (sessionId) => {
		setActiveSessionId(sessionId);
		// Store the sessionId in localStorage before redirecting to OAuth
		localStorage.setItem('pendingMeetingSessionId', sessionId);
	};

	const cleanupModal = () => {
		const backdrop = document.querySelector('.modal-backdrop');
		if (backdrop) {
			backdrop.remove();
		}
		document.body.classList.remove('modal-open');
		document.body.style.removeProperty('padding-right');
	};

	const acceptedSessions = store.customerSessions.filter(session => session.mentor_id != null);
	const openSessions = store.customerSessions.filter(session => session.mentor_id == null && session.is_active);
	const draftSessions = store.customerSessions.filter(session => session.mentor_id == null && !session.is_active)
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

	const handleConfirmMentor = async () => {
		const { sessionId, mentorId, date, startTime, endTime } = confirmModalData;
		if (!sessionId || !mentorId || !date || !startTime || !endTime) {
			alert("Please fill in all fields");
			return;
		}

		const startDateTime = new Date(`${date}T${startTime}`).toISOString();
		const endDateTime = new Date(`${date}T${endTime}`).toISOString();

		const success = await actions.confirmMentorForSession(sessionId, mentorId, startDateTime, endDateTime);
		if (success) {
			alert("Mentor confirmed successfully");
			actions.getCustomerSessions(); // Refresh the sessions
			cleanupModal()
			// Close the modal
		} else {
			console.error("Failed to confirm mentor");
			// You might want to show an error message to the user here
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const months = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		const day = date.getDate();
		const month = months[date.getMonth()];

		// Add appropriate suffix to day
		const suffix =
			day % 10 === 1 && day !== 11 ? "st" :
				day % 10 === 2 && day !== 12 ? "nd" :
					day % 10 === 3 && day !== 13 ? "rd" : "th";

		return `${month} ${day}${suffix}`;
	};

	const formatTime = (dateString) => {
		const date = new Date(dateString);
		let hours = date.getHours();
		let minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';

		// Convert to 12-hour format
		hours = hours % 12;
		hours = hours ? hours : 12; // Handle midnight (0:00)

		// Ensure minutes have leading zero if needed
		minutes = minutes < 10 ? '0' + minutes : minutes;

		return `${hours}:${minutes}${ampm}`;
	};

	const renderSessionMessages = (session, isInGoogleMeet = false) => {

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

																{/* Only show Confirm Mentor button if not in Google Meet modal */}
																{/* Confirm Mentor Modal Button */}
																{/* Confirm Mentor Modal Button */}
																{/* Confirm Mentor Modal Button */}

																{!isInGoogleMeet && (
																	<button
																		type="button"
																		className="btn btn-success"
																		data-bs-toggle="modal"
																		data-bs-target={`#ConfirmMentorModal${session.id}${mentorId}`}
																		onClick={() => setConfirmModalData({ ...confirmModalData, sessionId: session.id, mentorId: mentorId })}
																	>
																		Confirm Mentor
																	</button>
																)}

																{/* Confirm Mentor Modal - only rendered if not in Google Meet modal */}
																{/* Confirm Mentor Modal */}
																{/* Confirm Mentor Modal */}
																{/* Confirm Mentor Modal */}
																{!isInGoogleMeet && (
																	<div
																		className="modal fade"
																		id={`ConfirmMentorModal${session.id}${mentorId}`}
																		tabIndex="-1"
																		role="dialog"
																		aria-labelledby={`ConfirmMentorModalTitle${session.id}${mentorId}`}
																		aria-hidden="true"
																	>
																		<div className="modal-dialog modal-dialog-centered" role="document">
																			<div className="modal-content">
																				<div className="modal-header">
																					<h5 className="modal-title" id={`ConfirmMentorModalTitle${session.id}${mentorId}`}>Confirm Mentor</h5>
																					<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
																				</div>
																				<div className="modal-body">
																					<form>
																						<div className="mb-3">
																							<label htmlFor="date" className="form-label">Date</label>
																							<input
																								type="date"
																								className="form-control"
																								id="date"
																								value={confirmModalData.date}
																								onChange={(e) => setConfirmModalData({ ...confirmModalData, date: e.target.value })}
																							/>
																						</div>
																						<div className="mb-3">
																							<label htmlFor="startTime" className="form-label">Start Time</label>
																							<input
																								type="time"
																								className="form-control"
																								id="startTime"
																								value={confirmModalData.startTime}
																								onChange={(e) => setConfirmModalData({ ...confirmModalData, startTime: e.target.value })}
																							/>
																						</div>
																						<div className="mb-3">
																							<label htmlFor="endTime" className="form-label">End Time</label>
																							<input
																								type="time"
																								className="form-control"
																								id="endTime"
																								value={confirmModalData.endTime}
																								onChange={(e) => setConfirmModalData({ ...confirmModalData, endTime: e.target.value })}
																							/>
																						</div>
																					</form>
																				</div>
																				<div className="modal-footer">
																					<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
																					<button type="button" className="btn btn-success" onClick={() => handleConfirmMentor(session.id, mentorId)}>Confirm Mentor</button>
																				</div>
																			</div>
																		</div>


																	</div>

																)}
																{/* Confirm Mentor Modal End */}
																{/* Confirm Mentor Modal End */}
																{/* Confirm Mentor Modal End */}
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
			<h1 className="text-center mt-5">Welcome to the Student Dashboard</h1>
			<div>


				<div className="card border-secondary shadow border-2" >
					<div id="Header" className="card-header bg-light-subtle mb-5  " >
						<h2>Accepted Sessions</h2>
					</div>

					<div className="open-sessions container mb-3 ">
						<div className="row">
							{acceptedSessions.map((session) => (
								<div key={session.id} className="col-12 col-md-6 col-lg-4 mb-4">
									<div className="session-card card h-100">
										<img variant="top" className="card-img-top" src={session.mentor_photo_url} alt="Session" />
										<div className="card-body">
											<div className="row align-items-center justify-content-center">
												<label className="col-auto"><strong>Session with:</strong></label>
												<div className="col-auto sessionTitle">
													<strong>{session.mentor_name
														.split(' ')
														.map(word => word.charAt(0).toUpperCase() + word.slice(1))
														.join(' ')}</strong>
												</div>
											</div>

											<div className="text-center">
												<div className="sessionTitle"><h4>{session.title}</h4></div>
											</div>
											<div className="sessionDescription">{session.description}</div>
											<div className="container-fluid justify-content-between d-flex">
												<div className="row">
													<div className="col-5 ">
														<label ><strong>Duration:</strong></label>
														<div>{session.duration + " Minutes"}</div>

														<div className="text-secondary-emphasis rounded" >
															<label><strong>Total Hours:</strong> {session.totalHours} </label>
														</div>
													</div>
													<div className="col-7">
														<div className="text-secondary-emphasis rounded" >
															<div><strong>Date:</strong></div>
															<div >{formatDate(session.appointments[0].start_time)}</div>
														</div>


														<div ><strong>Time:</strong></div>
														<div >{formatTime(session.appointments[0].start_time) + "-" + formatTime(session.appointments[0].end_time)}</div>
													</div>
												</div>
											</div>

											<div className="row mt-3">
												<div className="col text-center">

													<button
														type="button"
														className="btn btn-primary"
														data-bs-toggle="modal"
														data-bs-target={`#GoogleMeetModal${session.id}`}
														onClick={async () => {
															const success = await actions.getMentorById(session.mentor_id);
															if (!success) {
																console.error("Failed to fetch mentor details");
																// Optionally show an error message to the user
															}
														}}
													>
														Launch Google Meet Now
													</button>



												</div>
												<div className="container-fluid justify-content-between d-flex">
													{/* MODAL FOR GOOGLEMEET */}
													{/* MODAL FOR GOOGLEMEET */}
													{/* MODAL FOR GOOGLEMEET */}
													{/* MODAL FOR GOOGLEMEET */}

													<div className="modal fade"
														onClick={() => handleGoogleMeetClick(session.id)}
														id={`GoogleMeetModal${session.id}`}
														tabIndex="-1"
														aria-labelledby={`GoogleMeetModal${session.id}`}
														aria-hidden="true"
													>
														<div className="modal-dialog modal-dialog-centered modal-xl">
															<div className="modal-content">
																<div className="modal-header bg-light-subtle">
																	<h1 className="modal-title fs-5" id="exampleModalLabel">
																		{`Meet with ${session.mentor_name
																			.split(" ")
																			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
																			.join(" ")}`}
																	</h1>
																	<h2>{session.mentor_id}</h2>
																	<button
																		type="button"
																		className="btn-close"
																		data-bs-dismiss="modal"
																		aria-label="Close">
																	</button>
																</div>
																<div className="modal-body">
																	<div className="container-fluid">
																		<div className="row">
																			<div className="col-12">
																				<GoogleMeeting 
																					mentor={store.selectedMentor} 
																					session={session}
																					/>
																				{renderSessionMessages(session, true)}
																			</div>
																		</div>
																	</div>
																</div>
																<div className="modal-footer">
																	<button
																		type="button"
																		className="btn btn-secondary"
																		data-bs-dismiss="modal"
																		onClick={cleanupModal}
																	>
																		Close
																	</button>
																	<button type="button" className="btn btn-primary">
																		Save changes
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
												{/* MODAL FOR GOOGLEMEET END */}
												{/* MODAL FOR GOOGLEMEET END */}
												{/* MODAL FOR GOOGLEMEET END */}
												{/* MODAL FOR GOOGLEMEET END */}

											</div>

										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>


				<div className="card border-secondary shadow border-2 mt-5">
					<div id="header" className="card-header bg-light-subtle mb-5">
						<h2>Open Sessions</h2>
					</div>

					<div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead className="border-bottom">
								<tr>
									<th scope="col">Title</th>
									<th scope="col">Description</th>
									<th scope="col">Skills</th>
									<th scope="col">Focus Areas</th>
									<th scope="col">Resource Link</th>
									<th scope="col">Actions</th>
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
												<a
													href={session.resourceLink.startsWith('http') ? session.resourceLink : `https://${session.resourceLink}`}
													target="_blank"
													rel="noopener noreferrer"
													aria-label={`Resource link for ${session.title}`}
												>
													{session.resourceLink}
												</a>
											</td>
											<td>
												<Link to={`/edit-session/${session.id}`} className="btn btn-primary btn-sm" aria-label={`Edit session ${session.title}`}>
													Edit
												</Link>
												<button
													className="btn btn-danger mt-2"
													onClick={() => handleDeleteSession(session.id)}
													aria-label={`Delete session ${session.title}`}
												>
													Delete Session
												</button>
											</td>
										</tr>
										{renderSessionMessages(session)}
									</React.Fragment>
								))}
							</tbody>
						</table>
					</div>
				</div>


				<div className="card border-secondary shadow border-2 mt-5">
					<div id="header" className="card-header bg-light-subtle mb-5">
						<h2>Draft Sessions</h2>
					</div>
					<div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th scope="col">Title</th>
									<th scope="col">Description</th>
									<th scope="col">Skills</th>
									<th scope="col">Focus Areas</th>
									<th scope="col">Resource Link</th>
									<th scope="col">Actions</th>
								</tr>
							</thead>
							<tbody>
								{draftSessions.map((session) => (
									<React.Fragment key={session.id}>
										<tr>
											<td>{session.title}</td>
											<td>{session.description}</td>
											<td>{session.skills.join(', ')}</td>
											<td>{session.focus_areas.join(', ')}</td>
											<td>
												<a
													href={session.resourceLink.startsWith('http') ? session.resourceLink : `https://${session.resourceLink}`}
													target="_blank"
													rel="noopener noreferrer"
													aria-label={`Resource link for ${session.title}`}
												>
													{session.resourceLink}
												</a>
											</td>
											<td>
												<Link
													to={`/edit-session/${session.id}`}
													className="btn btn-primary btn-sm"
													aria-label={`Edit session ${session.title}`}
												>
													Edit
												</Link>
												<button
													className="btn btn-danger mt-2"
													onClick={() => handleDeleteSession(session.id)}
													aria-label={`Delete session ${session.title}`}
												>
													Delete Session
												</button>
											</td>
										</tr>
										{renderSessionMessages(session)}
									</React.Fragment>
								))}
							</tbody>
						</table>
					</div>
				</div>



				<div className="card border-secondary shadow border-2 mt-5">
					<div id="header" className="card-header bg-light-subtle mb-5">
						<h2>Past Sessions</h2>
					</div>
					<div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th scope="col">Title</th>
									<th scope="col">Description</th>
									<th scope="col">Skills</th>
									<th scope="col">Focus Areas</th>
									<th scope="col">Resource Link</th>
									<th scope="col">Actions</th>
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
												<a
													href={session.resourceLink.startsWith('http') ? session.resourceLink : `https://${session.resourceLink}`}
													target="_blank"
													rel="noopener noreferrer"
													aria-label={`Resource link for ${session.title}`}
												>
													{session.resourceLink}
												</a>
											</td>
											<td>
												<Link
													to={`/edit-session/${session.id}`}
													className="btn btn-primary btn-sm"
													aria-label={`Edit session ${session.title}`}
												>
													Edit
												</Link>
												<button
													className="btn btn-danger btn-sm mt-2"
													onClick={() => handleDeleteSession(session.id)}
													aria-label={`Delete session ${session.title}`}
												>
													Delete Session
												</button>
											</td>
										</tr>
										{renderSessionMessages(session)}
									</React.Fragment>
								))}
							</tbody>
						</table>
					</div>
				</div>


			</div>
		</div>
	);
};