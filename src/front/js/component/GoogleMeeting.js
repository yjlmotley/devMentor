import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Calendar, DollarSign, Clock, Users, X, Edit2, Trash2, Plus, Link as LinkIcon } from "lucide-react";
import StripePaymentForm from "./PaymentForm";
import PaymentsPayouts from "../pages/PaymentsPayouts";

export const GoogleMeeting = ({ mentor, session }) => {
    const { store, actions } = useContext(Context);
    const [sessionId, setSessionId] = useState(session.id);
    const [meetingInfo, setMeetingInfo] = useState({
        link: "",
        loading: false,
        error: "",
        meetings: [],
    });

    const [meetingForm, setMeetingForm] = useState({
        summary: "New Meeting",
        duration: 60,
        description: "",
        attendees: "",
        isFormVisible: false,
    });
    const [sessionTotal, setSessionTotal] = useState("0");

    const handleFetchMentorDetails = () => {
        if (session.mentor_id) {
            actions.getMentorById(session.mentor_id);
        }
    };


    const startAuth = async () => {
        try {
            setMeetingInfo((prev) => ({ ...prev, loading: true, error: "" }));
            const response = await fetch(`${process.env.BACKEND_URL}/api/meet/auth`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                throw new Error(data.error || "Failed to start authentication");
            }
        } catch (error) {
            setMeetingInfo((prev) => ({
                ...prev,
                error: error.message,
                loading: false,
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeetingForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Calculate session total when duration changes
        if (name === 'duration') {
            const hourlyRate = mentor?.price || 0;
            const durationInHours = value / 60;
            const total = Math.round(hourlyRate * durationInHours);
            setSessionTotal(total);
        }
    };

    const createMeeting = async (e) => {
        e.preventDefault();
        try {
            setMeetingInfo((prev) => ({ ...prev, loading: true, error: "" }));

            const attendeesList = meetingForm.attendees
                .split(",")
                .map((email) => email.trim())
                .filter((email) => email);

            const response = await fetch(`${process.env.BACKEND_URL}/api/meet/create-meeting`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    summary: meetingForm.summary,
                    duration_minutes: parseInt(meetingForm.duration),
                    description: meetingForm.description,
                    attendees: attendeesList,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create meeting");
            }

            const data = await response.json();

            // Determine the appointment index dynamically
            if (session) {
                let newAppointmentIndex = 0;

                // Find the first available/unused appointment index
                while (session.appointments[newAppointmentIndex] &&
                    session.appointments[newAppointmentIndex].meetingUrl) {
                    newAppointmentIndex++;
                }

                const addMeetingResult = await actions.addMeetingToAppointment(
                    session.id,
                    newAppointmentIndex,
                    data.meetingUrl
                );

                if (!addMeetingResult) {
                    throw new Error("Failed to add meeting URL to appointment");
                }
            }

            setMeetingInfo((prev) => ({
                ...prev,
                meetings: [...prev.meetings, data],
                loading: false,
            }));

            setMeetingForm((prev) => ({
                ...prev,
                isFormVisible: false,
                summary: "New Meeting",
                duration: 60,
                description: "",
                attendees: "",
            }));
        } catch (error) {
            setMeetingInfo((prev) => ({
                ...prev,
                error: error.message,
                loading: false,
            }));
        }
    };

    const deleteMeeting = async (meetingId) => {
        try {
            setMeetingInfo((prev) => ({ ...prev, loading: true, error: "" }));

            const response = await fetch(`${process.env.BACKEND_URL}/api/meet/delete-meeting`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ meetingId }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete meeting");
            }

            setMeetingInfo((prev) => ({
                ...prev,
                meetings: prev.meetings.filter((meeting) => meeting.meetingId !== meetingId),
                loading: false,
            }));
        } catch (error) {
            setMeetingInfo((prev) => ({
                ...prev,
                error: error.message,
                loading: false,
            }));
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    return (
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border-4 border-gray-300 p-8">
                <div className="row">
                    <div className="col-6">
                        <h1 className="text-3xl font-bold mb-2 my-4 py-3">Google Meet Integration</h1>
                        <h5 className="mb-3">1. Authenticate with Google</h5>
                        <h5 className="mb-3">2. Add meeting details and duration </h5>
                        <h5 className="mb-3">3. Pre-Pay for you Mentors time </h5>
                        <h5 className="mb-3">4. Create meeting</h5>
                        <h5 className="mb-3">5. Created meeting link with auto-send to Mentor</h5>
                        <h5 className="mb-3">6. Join Meeting Link and meet mentor</h5>

                    </div>
                    <div className="col-6 py-5">
                        <div className="mb-6 flex justify-center">
                            <button
                                className="btn btn-primary flex items-center justify-center shadow px-5 py-3 rounded-full hover:bg-blue-600 transition-colors"
                                style={{ width: '200px', height: '200px' }}
                                onClick={startAuth}
                                disabled={meetingInfo.loading}
                            >
                                {meetingInfo.loading ? (
                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                ) : (
                                    <Users className="w-5 h-5 mr-2" />
                                )}
                                <p><strong>Authenticate with Google</strong></p>
                            </button>
                        </div>

                        {/* Create Meeting Button */}
                        <div className="mb-6 py-4 flex justify-center">
                            <button
                                className="btn btn-success flex items-center justify-center px-5 py-3 rounded-full hover:bg-green-600 transition-colors"
                                onClick={() => setMeetingForm((prev) => ({ ...prev, isFormVisible: true }))}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Meeting
                            </button>
                        </div>

                    </div>
                </div>


                {/* Auth Section */}


                {/* Meeting Form */}
                {meetingForm.isFormVisible && (


                    <form onSubmit={createMeeting} className="space-y-4">

                        <div className="card border border-secondary ">
                            <div className="card-header ">
                                Google Calendar Tags
                            </div>
                            <div className="col-12 rounded mb-1">

                                <div className="row g-0 mx-2">
                                    <div className="col-4">
                                        <label className="form-label small text-black">Meeting Title</label>
                                        <input
                                            type="text"
                                            name="summary"
                                            value={meetingForm.summary}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="Enter meeting title"
                                            required
                                        />
                                    </div>

                                    <div className="col-4 px-2">
                                        <label className="form-label small text-black">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={meetingForm.duration}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            min="15"
                                            placeholder="30"
                                            required
                                        />
                                    </div>

                                    <div className="col-4 ">
                                        <label className="form-label small text-black">Description</label>
                                        <textarea
                                            name="description"
                                            value={meetingForm.description}
                                            onChange={handleInputChange}
                                            className="form-control mb-3 "
                                            rows="3"
                                            placeholder="Optional meeting description"
                                        />
                                    </div>

                                    {/* <div className="col-12">
                                        <label className="form-label small text-black">Attendees (comma-separated emails)</label>
                                        <input
                                            type="text"
                                            name="attendees"
                                            value={meetingForm.attendees}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="email1@example.com, email2@example.com"
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        {/* Mentor Price and Pay */}
                        {/* Mentor Price and Pay */}
                        {/* Mentor Price and Pay */}
                        {/* Mentor Price and Pay */}

                        <div className="row g-2 ">
                            <div className="col-6">

                                {mentor ? (
                                    <div className="card border border-secondary mt-2 ">
                                        <div className="card-header pt-2">
                                            Mentor Details
                                        </div>
                                        <p className="ps-3 mt-2" >
                                            <strong>Name:</strong> {mentor.first_name} {mentor.last_name}
                                        </p>
                                        <p className="ps-3" >
                                            <strong>From:</strong> {mentor.city}
                                        </p>
                                        <p className="ps-3">
                                            <strong>Price:</strong> {formatPrice(mentor.price)} <strong>/hr</strong>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-red-500 text-center font-semibold">
                                        Mentor data not available
                                        {handleFetchMentorDetails(session.mentor_id)}
                                    </p>
                                )}
                            </div>

                            <div className="col-6">
                                {/* Add Stripe Here */}
                                {/* Add Stripe Here */}
                                {/* Add Stripe Here */}
                                {/* Add Stripe Here */}
                                <div className="card border border-secondary mt-2 ">
                                    <div className="card-header ">
                                        Session Total
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600 ps-3">
                                            <strong>Duration:</strong> {meetingForm.duration} minutes ({(meetingForm.duration / 60).toFixed(1)} hours)
                                        </p>
                                        <p className="text-sm text-gray-600 ps-3">
                                            <strong>Rate:</strong> {formatPrice(mentor?.price || 0)}/hour
                                        </p>
                                        <p className="text-lg font-bold text-gray-900 ps-3">
                                            <strong>Session Total:</strong> ${sessionTotal}
                                        </p>
                                    </div>
                                </div>
                                {/* End Stripe Payments */}
                                {/* End Stripe Payments */}
                                {/* End Stripe Payments */}
                                {/* End Stripe Payments */}
                            </div>
                            <div className="col-12">
                                <PaymentsPayouts

                                    sessionTotal={sessionTotal}
                                />
                            </div>
                        </div>

                        {/* Mentor Price and Pay End */}
                        {/* Mentor Price and Pay End */}
                        {/* Mentor Price and Pay End */}
                        {/* Mentor Price and Pay End */}
                        <div className="d-flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setMeetingForm(prev => ({ ...prev, isFormVisible: false }))}
                                className="btn btn-outline-secondary rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary rounded"
                                disabled={meetingInfo.loading}
                            >
                                {meetingInfo.loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Meeting'
                                )}
                            </button>
                        </div>
                    </form>



                )}

                {/* Error Display */}
                {meetingInfo.error && (
                    <div className="alert alert-danger mb-6">{meetingInfo.error}</div>
                )}

                {/* Meetings List */}
                <div className="space-y-4">
                    {meetingInfo.meetings.map((meeting) => (
                        <div
                            key={meeting.meetingId}
                            className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{meeting.summary}</h3>
                                    <div className="text-gray-500 mt-1">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {new Date(meeting.startTime).toLocaleString()}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Duration: {
                                                Math.round(
                                                    (new Date(meeting.endTime) - new Date(meeting.startTime)) / 1000 / 60
                                                )
                                            }{" "}
                                            minutes
                                        </div>
                                    </div>
                                    {meeting.attendees?.length > 0 && (
                                        <div className="text-gray-500 mt-1">
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {meeting.attendees.join(", ")}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => copyToClipboard(meeting.meetingUrl)}
                                        className="text-blue-500 hover:text-blue-600 transition-colors"
                                        title="Copy meeting link"
                                    >
                                        <LinkIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteMeeting(meeting.meetingId)}
                                        className="text-red-500 hover:text-red-600 transition-colors"
                                        title="Delete meeting"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>


                            <div className="mt-3">
                                <a
                                    href={meeting.meetingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success rounded-full px-5 py-3 hover:bg-green-600 transition-colors"
                                >
                                    Join Meeting
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};