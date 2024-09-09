import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";



export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogout = () => {
		actions.logOut();
		navigate("/mentor-login");
	}

	return (
		<nav className="navbar navbar-light bg-light bg-opacity-50 pt-3 p-0">
			<div className="container">
				<Link to="/" className="navbar-link">
					<span className="dancing-script-text">devMentor</span>
				</Link>
				{/* <Link to="/">
					<span className="navbar-brand mb-0 h1 btn btn-outline-secondary fw-bolder border-3">devMentor</span>
				</Link> */}

				<div className="d-flex gap-2">
					<div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Customers
							<i className="ms-2 fa-solid fa-school"></i>
						</button>
						<ul className="dropdown-menu dropdown-menu-end mt-1">
							<Link to="/customer-dashboard" className="dropdown-item bold-text text-end fa-solid fa-chalkboard"> Customer Dashboard</Link>
							{/* {store.isCustomerLoggedIn ? ( */}
								<>
									<Link to="/create-session" className="dropdown-item bold-text text-end fa-solid fa-folder-plus"> Create Session</Link>
									<button className="dropdown-item bold-text text-end fa-solid fa-right-to-bracket" onClick={handleLogout}> Log out</button>
								</>
							{/* ) : ( */}
								{/* <> */}
								<Link to="/" className="dropdown-item bold-text text-end fa-solid fa-user-plus"> Customer Sign up</Link>
								<Link to="/" className="dropdown-item bold-text text-end fa-solid fa-right-to-bracket"> Log in</Link>
								{/* </> */}
							{/* )} */}
						</ul>
					</div>
					<div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Mentors
							<i className="ms-2 fa-solid fa-person-chalkboard"></i>
						</button>
						<ul className="dropdown-menu dropdown-menu-end mt-1">
							{/* {store.isMentorLoggedIn ? ( */}
								<>
									<Link to="/mentor-dashboard" className="dropdown-item bold-text text-end fa-solid fa-chalkboard" > Mentor Dashboard</Link>
									<Link to="./mentor-profile" className="dropdown-item bold-text text-end fa-solid fa-id-card-clip"> Mentor Profile</Link>
									<button className="dropdown-item bold-text text-end fa-solid fa-right-to-bracket" onClick={handleLogout}> Log out</button>
								</>
							{/* ) : ( */}
								{/* <> */}
									<Link to="/mentor-signup" className="dropdown-item bold-text text-end fa-solid fa-user-plus"> Mentor Sign up</Link>
									<Link to="/mentor-login" className="dropdown-item bold-text text-end fa-solid fa-right-to-bracket"> Log in</Link>
								{/* </> */}
							{/* )} */}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};
