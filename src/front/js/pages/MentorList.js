import React, { useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import { MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";


export const MentorList = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        actions.getMentors();
    }, [])

    const handleNavigateToInstantSession = (mentorId) => {
        navigate(`/create-instant-session/${mentorId}`); // Navigate to new page with mentor ID
    };


    return (


        <>
        <div className="container card  border-secondary shadow border-2 px-0 mt-5">
					<div id="header" className="card-header bg-light-subtle mb-5">
                        <h1 className="text-center mt-5">Available Mentors</h1>
					</div>
            <div className="sessions-dashboard">
               
                <div className="container-fluid">
                    <div className="row">
                        {store.mentors.map((mentor) => (
                            <div key={mentor.id} className="col-12 col-sm-6 col-md-4 col-lg-2.4 col-xl mb-4">
                                <div className="card h-100">
                                    {/* Card Image */}
                                    <div className="card-img-top d-flex justify-content-center align-items-center" style={{ height: '200px', background: '#f8f9fa' }}>
                                        {mentor.profile_photo ? (
                                            <div style={{ width: '150px', height: '150px' }}>
                                                <img
                                                    src={mentor.profile_photo.image_url}
                                                    alt={`${mentor.first_name} ${mentor.last_name}`}
                                                    className="w-100 h-100 rounded-circle"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#e9ecef' }}></div>
                                        )}
                                    </div>

                                    <div className="card-body">
                                        {/* Header Section */}
                                        <div className="row align-items-center justify-content-center mb-3">
                                            <div className="col-auto">
                                                <h3 className="mb-0 fs-5">
                                                    {mentor.first_name || mentor.last_name ?
                                                        `${mentor.first_name} ${mentor.last_name}` :
                                                        'Unnamed Mentor'}
                                                </h3>
                                            </div>
                                            {mentor.is_active && (
                                                <div className="col-auto">
                                                    <span className="badge bg-success">Active</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Location and Contact */}
                                        <div className="container-fluid mb-3">
                                            <div className="row">
                                                <div className="col-12 mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <MapPin size={16} className="me-2" />
                                                        <span className="small">{mentor.city}, {mentor.what_state}, {mentor.country}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Experience and Price */}
                                        <div className="container-fluid justify-content-between d-flex mb-3">
                                            <div className="row w-100">
                                                <div className="col-6">
                                                    {mentor.years_exp && (
                                                        <div className="small">
                                                            <label><strong>Experience:</strong></label>
                                                            <div>{mentor.years_exp}</div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-6">
                                                    {mentor.price && mentor.price !== "None" && (
                                                        <div className="small">
                                                            <label><strong>Price:</strong></label>
                                                            <div>${mentor.price}/session</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        {mentor.skills && mentor.skills.length > 0 && (
                                            <div className="mb-3">
                                                <label className="fw-bold mb-2 small">Skills</label>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {mentor.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="badge bg-primary small"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Available Days */}
                                        {mentor.days && mentor.days.length > 0 && (
                                            <div className="mb-3">
                                                <label className="fw-bold mb-2 small">Available Days</label>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {mentor.days.map((day, index) => (
                                                        <span
                                                            key={index}
                                                            className="badge bg-secondary small"
                                                        >
                                                            {day}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* About Me Section with Modal Trigger */}
                                        {mentor.about_me && (
                                            <div>
                                                <label className="fw-bold mb-2 small">About</label>
                                                {/* Trigger Element for Modal */}
                                                <p
                                                    className="card-text text-truncate small"
                                                    role="button"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#aboutMeModal-${mentor.id}`}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {mentor.about_me}
                                                </p>

                                                {/* Modal Structure */}
                                                <div
                                                    className="modal fade"
                                                    id={`aboutMeModal-${mentor.id}`}
                                                    tabIndex="-1"
                                                    aria-labelledby={`aboutMeModalLabel-${mentor.id}`}
                                                    aria-hidden="true"
                                                >
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content" style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}>
                                                            <div className="modal-header" style={{ borderBottom: "1px solid #dee2e6" }}>
                                                                <h5 className="modal-title" id={`aboutMeModalLabel-${mentor.id}`} style={{ fontWeight: "bold", color: "#495057" }}>
                                                                    Mentor {mentor.first_name} {mentor.last_name}'s About Me
                                                                </h5>
                                                                <button
                                                                    type="button"
                                                                    className="btn-close"
                                                                    data-bs-dismiss="modal"
                                                                    aria-label="Close"
                                                                    style={{ outline: "none" }}
                                                                ></button>
                                                            </div>
                                                            <div className="modal-body" style={{ fontSize: "0.9rem", color: "#343a40" }}>
                                                                {mentor.about_me}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <div className="d-grid gap-2">
                                        <button 
                                        className="btn btn-primary" 
                                        type="button"
                                        onClick={() => handleNavigateToInstantSession(mentor.id)}
                                        >Book this Mentor Now!</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>

    )
}