import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Calendar, Clock, Users, X, Edit2, Trash2, Plus, Link as LinkIcon } from "lucide-react";

export const GoogleMeeting = () => {
  const { store, actions } = useContext(Context);
  const [meetingInfo, setMeetingInfo] = useState({
    link: "",
    loading: false,
    error: "",
    meetings: [], // Store all created meetings
  });

  const [meetingForm, setMeetingForm] = useState({
    summary: "New Meeting",
    duration: 60,
    description: "",
    attendees: "",
    isFormVisible: false,
  });

  const startAuth = async () => {
    try {
      setMeetingInfo(prev => ({ ...prev, loading: true, error: "" }));
      const response = await fetch(`${process.env.BACKEND_URL}/api/meet/auth`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (response.ok && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || 'Failed to start authentication');
      }
    } catch (error) {
      setMeetingInfo(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createMeeting = async (e) => {
    e.preventDefault(); // Always prevent default for form submissions
    try {
      setMeetingInfo(prev => ({ ...prev, loading: true, error: "" }));
      
      const attendeesList = meetingForm.attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email);

      const response = await fetch(`${process.env.BACKEND_URL}/api/meet/create-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: meetingForm.summary,
          duration_minutes: parseInt(meetingForm.duration),
          description: meetingForm.description,
          attendees: attendeesList
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create meeting');
      }
      
      const data = await response.json();
      setMeetingInfo(prev => ({ 
        ...prev, 
        meetings: [...prev.meetings, data],
        loading: false 
      }));
      setMeetingForm(prev => ({ 
        ...prev, 
        isFormVisible: false,
        summary: "New Meeting",
        duration: 60,
        description: "",
        attendees: ""
      }));
    } catch (error) {
      setMeetingInfo(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false 
      }));
    }
  };

  const deleteMeeting = async (meetingId) => {
    try {
      setMeetingInfo(prev => ({ ...prev, loading: true, error: "" }));
      
      const response = await fetch(`${process.env.BACKEND_URL}/api/meet/delete-meeting`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ meetingId }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete meeting');
      }
      
      setMeetingInfo(prev => ({
        ...prev,
        meetings: prev.meetings.filter(meeting => meeting.meetingId !== meetingId),
        loading: false
      }));
    } catch (error) {
      setMeetingInfo(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">Google Meet Integration</h1>
          
          {/* Auth Section */}
          <div className="mb-6">
            <button 
              className="bg-blue-600 text-dark px-6 py-2 rounded-lg hover:bg-blue-700 
                         transition duration-200 flex items-center justify-center"
              onClick={startAuth}
              disabled={meetingInfo.loading}
            >
              {meetingInfo.loading ? (
                <span className="animate-spin mr-2">⌛</span>
              ) : (
                <Users className="w-5 h-5 mr-2" />
              )}
              Authenticate with Google
            </button>
          </div>

          {/* Create Meeting Button */}
          <button
            className="bg-green-600 text-dark px-6 py-2 rounded-lg hover:bg-green-700 
                       transition duration-200 flex items-center justify-center mb-6"
            onClick={() => setMeetingForm(prev => ({ ...prev, isFormVisible: true }))}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Meeting
          </button>

          {/* Meeting Form */}
          {meetingForm.isFormVisible && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {meetingInfo.error}
            </div>
          )}

          {/* Meetings List */}
          <div className="space-y-4">
            {meetingInfo.meetings.map((meeting) => (
              <div 
                key={meeting.meetingId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{meeting.summary}</h3>
                    <div className="text-sm text-gray-500 mt-1">
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
                        } minutes
                      </div>
                    </div>
                    {meeting.attendees?.length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
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
                      className="text-blue-600 hover:text-blue-800"
                      title="Copy meeting link"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteMeeting(meeting.meetingId)}
                      className="text-red-600 hover:text-red-800"
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
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-dark rounded-md hover:bg-green-700 transition duration-200"
                  >
                    Join Meeting
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};