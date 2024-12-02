import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Calendar, DollarSign, Clock, Users, X, Edit2, Trash2, Plus, Link as LinkIcon } from "lucide-react";

export const GoogleMeeting = ({ mentor, session }) => {
    const { store, actions } = useContext(Context);
    const [sessionId, setSessionId ] = useState(session.id);
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
    const [sessionTotal, setSessionTotal] = useState("60");

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

    // const createMeeting = async (e) => {
    //     e.preventDefault();
    //     try {
    //         setMeetingInfo((prev) => ({ ...prev, loading: true, error: "" }));

    //         const attendeesList = meetingForm.attendees
    //             .split(",")
    //             .map((email) => email.trim())
    //             .filter((email) => email);

    //         const response = await fetch(`${process.env.BACKEND_URL}/api/meet/create-meeting`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 summary: meetingForm.summary,
    //                 duration_minutes: parseInt(meetingForm.duration),
    //                 description: meetingForm.description,
    //                 attendees: attendeesList,
    //             }),
    //             credentials: "include",
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.error || "Failed to create meeting");
    //         }

    //         const data = await response.json();
    //         setMeetingInfo((prev) => ({
    //             ...prev,
    //             meetings: [...prev.meetings, data],
    //             loading: false,
    //         }));
    //         setMeetingForm((prev) => ({
    //             ...prev,
    //             isFormVisible: false,
    //             summary: "New Meeting",
    //             duration: 60,
    //             description: "",
    //             attendees: "",
    //         }));
    //     } catch (error) {
    //         setMeetingInfo((prev) => ({
    //             ...prev,
    //             error: error.message,
    //             loading: false,
    //         }));
    //     }
    // };

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
                        <h1 className="text-3xl font-bold mb-2 text-center my-4 py-3">Google Meet Integration</h1>
                        <h5 className="mb-4">1. Authenticate with Google</h5>
                        <h5 className="mb-4">2. Create Meeting</h5>
                        <h5 className="mb-4">3. Message Mentor Meeting Link</h5>
                        <h5 className="mb-6">4. Join Meeting Link and meet mentor</h5>
                        <h5 className="mb-6">5. Your Session id is {session.id}</h5>
                        <h5 className="mb-6">6. Your Mentor id is {session.mentor_id}</h5>


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
                    <div className="bg-gray-100 rounded-2xl p-6 mb-6">
                        <form onSubmit={createMeeting} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meeting Title
                                </label>
                                <input
                                    type="text"
                                    name="summary"
                                    value={meetingForm.summary}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={meetingForm.duration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    min="15"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={meetingForm.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Attendees (comma-separated emails)
                                </label>
                                <input
                                    type="text"
                                    name="attendees"
                                    value={meetingForm.attendees}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="email1@example.com, email2@example.com"
                                />
                            </div>
                            {/* Mentor Price and Pay */}
                            {/* Mentor Price and Pay */}
                            {/* Mentor Price and Pay */}
                            {/* Mentor Price and Pay */}
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-6">
                                        {mentor ? (
                                            <div className="mb-4">
                                                <h2 className="text-xl font-bold">Mentor Details</h2>
                                                <p>
                                                    <strong>Name:</strong> {mentor.first_name} {mentor.last_name}
                                                </p>
                                                <p>
                                                    <strong>Price:</strong> {formatPrice(mentor.price)} <strong>/hr</strong>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-red-500 text-center font-semibold">Mentor data not available</p>
                                        )}
                                    </div>
                                    <div className="col-6">
                                        {/* Add Stripe Here */}
                                        {/* Add Stripe Here */}
                                        {/* Add Stripe Here */}
                                        {/* Add Stripe Here */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="w-5 h-5 text-gray-600" />
                                                <h3 className="font-medium text-gray-900">Session Total</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">
                                                    Duration: {meetingForm.duration} minutes ({(meetingForm.duration / 60).toFixed(1)} hours)
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Rate: {formatPrice(mentor?.price || 0)}/hour
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    <h3 className="font-medium text-gray-900">Session Total: ${sessionTotal}</h3>
                                                </p>
                                            </div>
                                        </div>
                                        {/* End Stripe Payments */}
                                        {/* End Stripe Payments */}
                                        {/* End Stripe Payments */}
                                        {/* End Stripe Payments */}
                                    </div>
                                </div>
                            </div>
                            {/* Mentor Price and Pay End */}
                            {/* Mentor Price and Pay End */}
                            {/* Mentor Price and Pay End */}
                            {/* Mentor Price and Pay End */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setMeetingForm(prev => ({ ...prev, isFormVisible: false }))}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-dark rounded-md hover:bg-blue-700"
                                    disabled={meetingInfo.loading}
                                >
                                    Create Meeting
                                </button>
                            </div>
                        </form>

                    </div>
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