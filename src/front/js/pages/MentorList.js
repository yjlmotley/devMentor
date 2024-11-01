import React, { useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import { MapPin, Phone, Calendar, DollarSign, Award, User } from 'lucide-react';

export const MentorList = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.getMentors();
    }, [])


    return (


        <>
            <div className="sessions-dashboard">
                <h1 className="text-center mt-5">Available Mentors</h1>
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

                                        {/* About Me */}
                                        {mentor.about_me && (
                                            <div>
                                                <label className="fw-bold mb-2 small">About</label>
                                                <p className="card-text text-truncate small">
                                                    {mentor.about_me}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    )
}