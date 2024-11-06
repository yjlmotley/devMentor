import React, { useEffect, useContext, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { skillsList } from "../store/data";
import { Context } from "../store/appContext";
import ReactSlider from "react-slider";
import "../../styles/createSession.css";
import { useParams, useNavigate } from "react-router-dom";
import {
    ValidateTitle,
    ValidateDescription,
    ValidateSchedule,
    ValidateFocusAreas,
    ValidateSkills,
    ValidateResourceLink,
    ValidateDuration,
    ValidateTotalHours
} from "../component/Validators";

const TimeRangeSlider = ({ day, value, onChange }) => {
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours < 12 ? 'AM' : 'PM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <div className="mb-3">
            <ReactSlider
                className="time-range-slider"
                thumbClassName="time-range-thumb"
                trackClassName="time-range-track"
                value={[value.start, value.end]}
                min={0}
                max={1440}
                step={30}
                pearling
                minDistance={60}
                onChange={([start, end]) => onChange(day, { start, end })}
            />
            <div className="d-flex justify-content-between mt-2">
                <span>{formatTime(value.start)}</span>
                <span>{formatTime(value.end)}</span>
            </div>
        </div>
    );
};

export const CreateInstantSession = () => {
    const { mentorId } = useParams();
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();

    // Original form state
    const [title, setTitle] = useState("Instant Mentorship Session");
    const [description, setDescription] = useState("Quick booking session");
    const [schedule, setSchedule] = useState({
        monday: { checked: false, start: 540, end: 1020 },
        tuesday: { checked: false, start: 540, end: 1020 },
        wednesday: { checked: false, start: 540, end: 1020 },
        thursday: { checked: false, start: 540, end: 1020 },
        friday: { checked: false, start: 540, end: 1020 },
        saturday: { checked: false, start: 540, end: 1020 },
        sunday: { checked: false, start: 540, end: 1020 },
    });
    const [focus_areas, setFocusAreas] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [resourceLink, setResourceLink] = useState("");
    const [duration, setDuration] = useState("");
    const [totalHours, setTotalHours] = useState(0);
    const [invalidItems, setInvalidItems] = useState([]);

    // New state for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState({
        sessionId: null,
        mentorId: null,
        date: '',
        startTime: '',
        endTime: ''
    });
    const [createdSessionId, setCreatedSessionId] = useState(null);

    useEffect(() => {
        if (!store.token) {
            navigate("/customer-login");
        } else if (!store.mentors.length) {
            actions.getMentors();
        }
    }, [store.token, store.mentors.length]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setInvalidItems([]);

        const customerId = store.currentUserData?.user_data?.id;
        if (!customerId) {
            alert("User data is not available. Please try again.");
            return;
        }

        // Validate the form
        const isValid = ValidateTitle(title, setInvalidItems) &&
            ValidateDescription(description, setInvalidItems) &&
            ValidateSchedule(schedule, setInvalidItems) &&
            ValidateFocusAreas(focus_areas, setInvalidItems) &&
            ValidateSkills(selectedSkills, setInvalidItems) &&
            ValidateResourceLink(resourceLink, setInvalidItems) &&
            ValidateDuration(duration, setInvalidItems) &&
            ValidateTotalHours(totalHours, setInvalidItems);

        if (isValid) {
            const sessionData = {
                customer_id: customerId,
                title,
                description,
                schedule,
                is_active: true,
                focus_areas,
                skills: selectedSkills,
                resourceLink,
                duration,
                totalHours
            };

            // Create the session
            const createdSession = await actions.createSession(sessionData);

            if (createdSession) {
                setCreatedSessionId(createdSession.id);
                setConfirmModalData({
                    ...confirmModalData,
                    sessionId: createdSession.id,
                    mentorId: mentorId
                });
                // Show the confirmation modal
                setShowConfirmModal(true);
            } else {
                alert("Session creation failed.");
            }
        }
    };

    const handleConfirmMentor = async () => {
        const { sessionId, mentorId, date, startTime, endTime } = confirmModalData;
        if (!sessionId || !mentorId || !date || !startTime || !endTime) {
            alert("Please fill in all fields");
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`).toISOString();
        const endDateTime = new Date(`${date}T${endTime}`).toISOString();

        const success = await actions.confirmMentorForSession(sessionId, mentorId, startDateTime, endDateTime);
        if (success) {
            console.log("Mentor confirmed successfully");
            setShowConfirmModal(false);
            navigate("/customer-dashboard");
        } else {
            console.error("Failed to confirm mentor");
            alert("Failed to confirm mentor. Please try again.");
        }
    };

    const handleSelectChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.label) : [];
        setSelectedSkills(values);
    };

    const handleScheduleChange = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleTimeRangeChange = (day, { start, end }) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], start, end }
        }));
    };

    const handleFocusAreaChange = (area) => {
        setFocusAreas(prev =>
            prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
        );
    };

    const mentor = store.mentors.find(m => m.id === parseInt(mentorId));

    return (
        <>
            <div className="container mt-5">
                <h1 className="mb-4">Instant Session with {mentor ? `${mentor.first_name} ${mentor.last_name}` : "Mentor"}</h1>
                <form onSubmit={handleSubmit}>
                    {/* Title and Description */}
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            type="text"
                            className={`form-control ${invalidItems.includes("title") ? "is-invalid" : ""}`}
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        {invalidItems.includes("title") &&
                            <div className="invalid-feedback">Title must be between 5 and 125 characters</div>
                        }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className={`form-control ${invalidItems.includes("description") ? "is-invalid" : ""}`}
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                        {invalidItems.includes("description") &&
                            <div className="invalid-feedback">Description must be between 5 and 125 characters</div>
                        }
                    </div>

                    {/* Schedule */}
                    <div className="mb-3">
                        <label className="form-label">Availability</label>
                        {Object.entries(schedule).map(([day, value]) => (
                            <div key={day} className="mb-2">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={day}
                                        checked={value.checked}
                                        onChange={(e) => handleScheduleChange(day, 'checked', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor={day}>
                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                    </label>
                                </div>
                                {value.checked && (
                                    <TimeRangeSlider
                                        day={day}
                                        value={{ start: value.start, end: value.end }}
                                        onChange={handleTimeRangeChange}
                                    />
                                )}
                            </div>
                        ))}
                        {invalidItems.includes("schedule") &&
                            <div className="text-danger">Please select at least one day</div>
                        }
                    </div>

                    {/* Focus Areas, Skills, Resource Link */}
                    <div className="mb-3">
                        <label className="form-label">Focus Areas</label>
                        <div className="d-flex flex-wrap">
                            {["Career advice", "Resume review", "Mock interview", "Machine Learning", "Algorithms", "AI", "SAAS", "WebApp Building", "Coding"].map((area) => (
                                <div key={area} className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={area}
                                        checked={focus_areas.includes(area)}
                                        onChange={() => handleFocusAreaChange(area)}
                                    />
                                    <label className="form-check-label" htmlFor={area}>
                                        {area}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {invalidItems.includes("focus_areas") &&
                            <div className="text-danger">Please select at least one focus area</div>
                        }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="skills" className="form-label">Skills Required</label>
                        <CreatableSelect
                            isMulti
                            name="skills"
                            classNamePrefix="select"
                            value={selectedSkills.map(skill => ({ value: skill, label: skill }))}
                            onChange={handleSelectChange}
                            options={skillsList}
                            className={invalidItems.includes("skills") ? "is-invalid" : ""}
                        />
                        {invalidItems.includes("skills") &&
                            <div className="text-danger">Please select at least one skill</div>
                        }
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Resource Link</label>
                        <div className="input-group">
                            <span className="input-group-text">https://</span>
                            <input
                                type="text"
                                className={`form-control ${invalidItems.includes("resourceLink") ? "is-invalid" : ""}`}
                                placeholder="Enter resource link"
                                value={resourceLink}
                                onChange={(e) => setResourceLink(e.target.value)}
                            />
                        </div>
                        {invalidItems.includes("resourceLink") &&
                            <div className="text-danger">Please enter a valid URL</div>
                        }
                    </div>

                    {/* Duration and Total Hours */}
                    <div className="mb-3">
                        <label htmlFor="duration" className="form-label">Duration</label>
                        <select
                            className={`form-select ${invalidItems.includes("duration") ? "is-invalid" : ""}`}
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option value="">Select duration</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                            <option value="150">2.5 hours</option>
                            <option value="180">3 hours</option>
                        </select>
                        {invalidItems.includes("duration") &&
                            <div className="invalid-feedback">Please select a session duration</div>
                        }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="totalHours" className="form-label">Total Hours</label>
                        <input
                            type="number"
                            className={`form-control ${invalidItems.includes("totalHours") ? "is-invalid" : ""}`}
                            id="totalHours"
                            value={totalHours}
                            onChange={(e) => setTotalHours(Number(e.target.value))}
                        />
                        {invalidItems.includes("totalHours") &&
                            <div className="invalid-feedback">Please enter a valid number of hours (1-100)</div>
                        }
                    </div>

                    <button type="submit" className="btn btn-warning w-100 mt-1 mb-4">Create Instant Session</button>
                </form>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Mentor Schedule</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowConfirmModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="date"
                                            value={confirmModalData.date}
                                            onChange={(e) => setConfirmModalData({
                                                ...confirmModalData,
                                                date: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="startTime" className="form-label">Start Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="startTime"
                                            value={confirmModalData.startTime}
                                            onChange={(e) => setConfirmModalData({
                                                ...confirmModalData,
                                                startTime: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="endTime" className="form-label">End Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="endTime"
                                            value={confirmModalData.endTime}
                                            onChange={(e) => setConfirmModalData({
                                                ...confirmModalData,
                                                endTime: e.target.value
                                            })}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleConfirmMentor}
                                >
                                    Confirm Mentor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateInstantSession;