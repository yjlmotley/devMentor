import React, { useState, useContext, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { skillsList } from "../store/data";
import { Context } from "../store/appContext";
import ReactSlider from "react-slider";
import "../../styles/createSession.css";
import { useNavigate, useParams } from "react-router-dom";

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

export const EditSession = () => {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [is_active, setIs_Active] = useState(false);
  const [schedule, setSchedule] = useState({
    monday: { checked: false, start: 540, end: 1020 },
    tuesday: { checked: false, start: 540, end: 1020 },
    wednesday: { checked: false, start: 540, end: 1020 },
    thursday: { checked: false, start: 540, end: 1020 },
    friday: { checked: false, start: 540, end: 1020 },
    saturday: { checked: false, start: 540, end: 1020 },
    sunday: { checked: false, start: 540, end: 1020 },
  });
  const [focus_areas, setfocus_areas] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [resourceLink, setResourceLink] = useState("");
  const [duration, setDuration] = useState("");
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    if (!store.token) {
      // navigate("/customer-login");
      alert("Please log in again.");
      navigate("/");
    } else {
      loadSessionData();
    }
  }, [store.token, sessionId]);

  const loadSessionData = async () => {
    const sessionData = await actions.getSessionById(sessionId);
    if (sessionData) {
      setTitle(sessionData.title);
      setDescription(sessionData.description);
      setIs_Active(sessionData.is_active);
      setSchedule(sessionData.schedule);
      setfocus_areas(sessionData.focus_areas);
      setSelectedSkills(sessionData.skills);
      setResourceLink(sessionData.resourceLink);
      setDuration(sessionData.duration);
      setTotalHours(sessionData.totalHours);
    } else {
      alert("Failed to load session data.");
      navigate("/sessions");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting form...");

    const updatedSession = {
      title,
      description,
      schedule,
      is_active,
      focus_areas,
      skills: selectedSkills,
      resourceLink,
      duration,
      totalHours
    };

    console.log("Updated session data:", updatedSession);

    try {
      const success = await actions.editSession(sessionId, updatedSession, store.token);
      if (success) {
        alert("Session updated successfully!");
        navigate("/customer-dashboard");
      } else {
        alert("Something went wrong updating the Mentor Session.");
      }
    } catch (error) {
      console.error("Error updating session:", error);
      alert("An error occurred while updating the session.");
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
    setfocus_areas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Edit Session</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="is_active" className="form-label">Visibility</label>
          <select
            className="form-select"
            id="is_active"
            value={is_active ? "True" : "False"}
            onChange={(e) => setIs_Active(e.target.value === "True")}
          >
            <option value="True">Public</option>
            <option value="False">Private</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">When are you free?</label>
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
        </div>

        <div className="mb-3">
          <label className="form-label">Focus areas</label>
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
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Attach resources</label>
          <div className="input-group">
            <span className="input-group-text">https://</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter resource link"
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
            />
          </div>
        </div>

        <h2 className="mb-3">Finalize session</h2>

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">Duration</label>
          <select
            className="form-select"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="150">2.5 hours</option>
            <option value="180">3 hours</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="total_hours" className="form-label">Total Hours</label>
          <div className="input-group">
            <span className="input-group-text">#</span>
            <input
              type="number"
              className="form-control"
              id="totalHours"
              value={totalHours}
              onChange={(e) => setTotalHours(Number(e.target.value))}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-warning w-100 mt-1 mb-4">Update Session</button>
      </form>
    </div>
  );
};

export default EditSession;