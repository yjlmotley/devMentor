import React, { useState, useEffect, useContext, useCallback } from "react";
import { Context } from "../store/appContext";
import "../../styles/MentorSessionBoard.css";

export const MentorSessionBoard = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState('all');
    const [characterCount, setCharacterCount] = useState(0);
    const [message, setMessage] = useState("");
    const [currentSessionId, setCurrentSessionId] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await actions.getCurrentUser();
            await actions.getAllSessionRequests();
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleMessage = (e) => {
        const value = e.target.value;
        if (value.length <= 2500) {
            setMessage(value);
            setCharacterCount(value.length);
        }
    };

    const handleSendMessage = async () => {
        if (currentSessionId) {
            try {
                let success = await actions.sendMessageMentor(currentSessionId, message);
                if (success) {
                    setMessage("");
                    setCurrentSessionId(null);
                    document.getElementById('availabilityModal').querySelector('.btn-close').click();
                    // Refresh session requests to get the updated messages
                    await actions.getAllSessionRequests();
                } else {
                    throw new Error("Failed to send message");
                }
            } catch (err) {
                alert("Failed to send your message. Please try again later.");
            }
        } else {
            alert("No session selected. Please try again.");
        }
    }

    const openMessageModal = (sessionId) => {
        setCurrentSessionId(sessionId);
        setMessage("");
        setCharacterCount(0);
    }

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const formatSchedule = (schedule) => {
        return Object.entries(schedule)
            .filter(([day, slot]) => slot.checked)
            .map(([day, slot]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${formatTime(slot.start)} - ${formatTime(slot.end)}`)
            .join(', ');
    };

    const filterSessionsIsActiveAndIsNotCompleted = (sessions) => {
        return sessions.filter(session => 
            session.is_active === true &&
            session.is_completed === false
        );
    };

    const renderMessages = (session) => {
        const mentorId = store.mentorId;
        return session.messages
            .filter(msg => msg.mentor_id === mentorId || msg.sender === "customer")
            .sort((a, b) => new Date(a.time_created) - new Date(b.time_created))
            .map((msg) => (
                <div key={msg.id} className="message-row">
                    <strong>{msg.sender === "mentor" ? `Mentor (${msg.mentor_name})` : "Customer"}:</strong> {msg.text}
                    <p className="text-muted">{new Date(msg.time_created).toLocaleString()}</p>
                </div>
            ));
    };

	if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="session-board-container container ">
            <div className="session-board card-custom">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="session-title">Sessions</h1>
                </div>

                <ul className="nav nav-tabs mb-3 custom-nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            Upcoming
                        </button>
                    </li>
                </ul>

                <div className="table-responsive">
                    <table className="table table-hover custom-table">
                        <thead>
                            <tr>
                                <th>Session</th>
                                <th>Description</th>
                                <th>Skills</th>
                                <th>Schedule</th>
                                <th>Created</th>
                                <th>Focus areas</th>
                                <th>Resource_link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.sessionRequests && filterSessionsIsActiveAndIsNotCompleted(store.sessionRequests).map((session) => (
                                <React.Fragment key={session.id}>
                                    <tr>
                                        <td>{session.title}</td>
                                        <td>{session.description}</td>
                                        <td>{session.skills.join(', ')}</td>
                                        <td>{formatSchedule(session.schedule)}</td>
                                        <td>{new Date(session.time_created).toLocaleDateString()}</td>
                                        <td>{session.focus_areas.join(', ')}</td>
                                        <td>
                                            <a href={session.resourceLink.startsWith('http') ? session.resourceLink : `https://${session.resourceLink}`}>
                                                {session.resourceLink}
                                            </a>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                data-bs-toggle="modal"
                                                data-bs-target="#availabilityModal"
                                                onClick={() => openMessageModal(session.id)}
                                            >
                                                Send Message
                                            </button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan="8">
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
                                                            Your messages with {session.customer_name}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`flush-collapse${session.id}`}
                                                        className="accordion-collapse collapse"
                                                        data-bs-parent={`#accordionFlush${session.id}`}
                                                    >
                                                        <div className="accordion-body">
                                                            {renderMessages(session)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal fade" id="availabilityModal" tabIndex="-1" aria-labelledby="availabilityModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="availabilityModalLabel">Message Customer</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                name="about_me"
                                value={message}
                                onChange={handleMessage}
                                className="form-control"
                                rows="4"
                            ></textarea>
                            <p className={characterCount > 2500 ? "text-danger" : ''}>{characterCount}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={handleSendMessage} className="btn btn-primary">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};