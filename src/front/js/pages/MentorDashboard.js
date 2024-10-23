import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";


export const MentorDashboard = () => {
	const { store, actions } = useContext(Context);
	const [confirmedSessions, setConfirmedSessions] = useState([])

	useEffect(() => {
		const refreshUserData = async () => {
			let success = await actions.getCurrentUser()
			if (success) {
				setConfirmedSessions(store.currentUserData.user_data.confirmed_sessions)
			} else {
				alert("Unable to retrieve sessions please contact admin")
			}
		}
		refreshUserData()

	}, [])

	// Helper function to format date to "Month Day(st/nd/rd/th)"
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

	// Helper function to format time to 12-hour format with AM/PM
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


	return (
		<div className="text-center mt-5">
			<h1>MENTOR DASHBOARD</h1>
			<div className="open-sessions container">
				<div className="row">
					{confirmedSessions.map((session) => (
						<div key={session.id} className="col-12 col-md-6 col-lg-4 mb-4">
							<div className="session-card card h-100">
								{/* <img variant="top" className="card-img-top" src="https://res.cloudinary.com/dufs8hbca/image/upload/v1720223404/aimepic_vp0y0t.jpg" alt="Session" /> */}
								<div className="card-body">
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
									<div>{session.description}</div>
									<div className="container-fluid justify-content-between d-flex">
										<div className="row">
											<div className="col-5 ">
												<label ><strong>Duration:</strong></label>
												<div>{session.duration+" Minutes"}</div>
												
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
												<div >{formatTime(session.appointments[0].start_time)+"-"+formatTime(session.appointments[0].end_time)}</div>
											</div>
										</div>
									
										
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

		</div>
	);
};
