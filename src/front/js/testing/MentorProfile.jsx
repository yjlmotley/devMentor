import React from 'react';
import './mentorProfile.css';
import ProjectPortfolio from './ProjectPortfolio.jsx';

function Testing1MentorProfile() {
    return (
        <div className="mentor-profile">
            <div className="row">
                <div className="col-md-4">
                    <div className="profile-picture">
                        <img src="https://via.placeholder.com/150" alt="Profile" className="img-fluid rounded-circle" />
                    </div>
                </div>
                <div className="col-md-8">
                    <h2>Mentor Name</h2>
                    <p><strong>Nickname:</strong> Your Nickname</p>
                    <p><strong>Email:</strong> your-email@example.com</p>
                    <p><strong>Phone:</strong> (123) 456-7890</p>
                    <p><strong>Location:</strong> City, State, Country</p>
                    <p><strong>Experience:</strong> 8 years</p>
                </div>
            </div>
            <div className="availability">
                <h4>Days Available</h4>
                <p>Mon - Fri</p>
                <p><strong>Rate:</strong> $50/hour</p>
            </div>
            <div className="about-me">
                <h4>About Me</h4>
                <p>Brief description about your expertise and what you offer as a mentor.</p>
            </div>
            <div className="skills">
                <h4>Skills</h4>
                <div className="skill-list">
                    <span className="badge badge-primary">HTML</span>
                    <span className="badge badge-secondary">CSS</span>
                    <span className="badge badge-success">JavaScript</span>
                    <span className="badge badge-danger">React</span>
                </div>
            </div>
            <div className="portfolio">
                <h4>Project Portfolio</h4>
                <ProjectPortfolio />
                {/* This will be a dynamic portfolio component */}
            </div>
        </div>
    );
}
export default Testing1MentorProfile;