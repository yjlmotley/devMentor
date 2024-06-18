import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
				<div className="dropdown">
					<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						TBD Pages Views
					</button>
					<ul className="dropdown-menu dropdown-menu-end">
						<Link to="/mentor-dashboard" className="dropdown-item bold-text text-end">Mentor Dashboard</Link>
						<Link to="/mentor-profile" className="dropdown-item bold-text text-end">Mentor Profile</Link>
						<Link to="/mentor-session-board" className="dropdown-item bold-text text-end">Mentor Session Board</Link>
						<Link to="/customer-dashboard" className="dropdown-item bold-text text-end">Customer Dashboard</Link>
						<Link to="/create-session" className="dropdown-item bold-text text-end">Create Session</Link>
					</ul>
				</div>
			</div>
		</nav>
	);
};
