import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { CustomerAuthModal } from "../auth/CustomerAuthModal.js";
import { MentorAuthModal } from "../auth/MentorAuthModal.js";
import "../../styles/navbar.css";


export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [showCustomerAuthModal, setShowCustomerAuthModal] = useState(false);
	const [showMentorAuthModal, setShowMentorAuthModal] = useState(false);
	const [activeAuthTab, setActiveAuthTab] = useState('login');

	const handleShowCustomerAuth = (tab) => {
		setActiveAuthTab(tab);
		setShowCustomerAuthModal(true);
	};

	const handleShowMentorAuth = (tab) => {
		setActiveAuthTab(tab);
		setShowMentorAuthModal(true);
	};

	const handleLogout = () => {
		actions.logOut();
		navigate("/");
	}

	return (
		<>
			<nav className="navbar navbar-light bg-light bg-opacity-50 pt-3 p-0">
				<div className="container">
					<Link to="/" className="navbar-link">
						<span className="dancing-script-text">devMentor</span>
					</Link>
					{/* <Link to="/">
					<span className="navbar-brand mb-0 h1 btn btn-outline-secondary fw-bolder border-3">devMentor</span>
				</Link> */}

					<div className="d-flex gap-2">

						{!store.isMentorLoggedIn &&
							<div className="dropdown navbar-dropdown">
								<button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									Customers
									<i className="ms-3 fa-solid fa-school" />
								</button>
								<ul className="dropdown-menu dropdown-menu-end mt-1">
									{store.isCustomerLoggedIn ? (
										<>
											<Link to="/customer-dashboard" className="dropdown-item bold-text text-end">
												<span className="navbarFont">Customer Dashboard</span>
												<i className="fa-solid fa-chalkboard" />
											</Link>
											<Link to="/create-session" className="dropdown-item bold-text text-end">
												<span className="navbarFont">Create Session</span>
												<i className="fa-solid fa-folder-plus" />
											</Link>
											<Link to="/mentor-list" className="dropdown-item bold-text text-end">
												<span className="navbarFont">Find A Mentor</span>
												<i className="fa-solid fa-folder-plus" />
											</Link>
											<button className="dropdown-item bold-text text-end" onClick={handleLogout}>
												<span className="navbarFont">Log Out</span>
												<i className="fa-solid fa-right-from-bracket" />
											</button>
										</>
									) : (
										<>
											<button
												className="dropdown-item bold-text text-end"
												onClick={() => handleShowCustomerAuth('signup')}
											>
												<span className="navbarFont">Customer Sign Up</span>
												<i className="fa-solid fa-user-plus" />
											</button>
											<button
												className="dropdown-item bold-text text-end"
												onClick={() => handleShowCustomerAuth('login')}
											>
												<span className="navbarFont">Log In</span>
												<i className="fa-solid fa-right-to-bracket" />
											</button>
										</>
									)}
								</ul>
							</div>
						}

						{!store.isCustomerLoggedIn &&
							<div className="dropdown navbar-dropdown">
								<button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									Mentors
									<i className="ms-3 fa-solid fa-person-chalkboard"></i>
								</button>
								<ul className="dropdown-menu dropdown-menu-end mt-1">
									{store.isMentorLoggedIn ? (
										<>
											<Link to="/mentor-dashboard" className="dropdown-item bold-text text-end" >
												<span className="navbarFont">Mentor Dashboard</span>
												<i className="fa-solid fa-chalkboard" />
											</Link>
											<Link to="./mentor-profile" className="dropdown-item bold-text text-end">
												<span className="navbarFont">Mentor Profile</span>
												<i className="fa-solid fa-user" />
											</Link>
											<Link to="/mentor-session-board" className="dropdown-item bold-text text-end">
												<span className="navbarFont">Mentor Session Board</span>
												<i className="fa-solid fa-id-card-clip" />
											</Link>
											<button className="dropdown-item bold-text text-end" onClick={handleLogout}>
												<span className="navbarFont">Log Out</span>
												<i className="fa-solid fa-right-from-bracket" />
											</button>
										</>
									) : (
										<>
											<button
												className="dropdown-item bold-text text-end"
												onClick={() => handleShowMentorAuth('signup')}
											>
												<span className="navbarFont">Mentor Sign Up</span>
												<i className="fa-solid fa-user-plus" />
											</button>
											<button
												className="dropdown-item bold-text text-end"
												onClick={() => handleShowMentorAuth('login')}
											>
												<span className="navbarFont">Log In</span>
												<i className="fa-solid fa-right-to-bracket" />
											</button>
										</>
									)}
								</ul>
							</div>
						}

					</div>
				</div>
			</nav>
			<CustomerAuthModal
				show={showCustomerAuthModal}
				onHide={() => setShowCustomerAuthModal(false)}
				initialTab={activeAuthTab}
			/>
			<MentorAuthModal
				show={showMentorAuthModal}
				onHide={() => setShowMentorAuthModal(false)}
				initialTab={activeAuthTab}
			/>
		</>
	);
};
