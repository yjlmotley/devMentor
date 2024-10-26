from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime, timedelta
from typing import Dict, Optional
import os
import json
import logging
from functools import wraps

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def require_auth(func):
    """Decorator to check if credentials exist before executing a method"""
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        if not self.credentials:
            raise AuthError("Not authenticated. Please complete OAuth flow first.")
        return func(self, *args, **kwargs)
    return wrapper

class AuthError(Exception):
    """Custom exception for authentication errors"""
    pass

class GoogleMeetService:
    def __init__(self):
        """Initialize the Google Meet Service with required scopes and configuration"""
        self.SCOPES = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ]
        self.credentials = None
        self._service = None
        
        # Validate required environment variables
        required_vars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'OAUTH_REDIRECT_URI']
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        if missing_vars:
            raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

    @property
    def client_config(self) -> Dict:
        """Return the OAuth client configuration"""
        return {
            "web": {
                "client_id": os.getenv('GOOGLE_CLIENT_ID'),
                "client_secret": os.getenv('GOOGLE_CLIENT_SECRET'),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [os.getenv('OAUTH_REDIRECT_URI')]
            }
        }

    @property
    def service(self):
        """Lazy loading of Google Calendar service"""
        if not self._service and self.credentials:
            self._service = build('calendar', 'v3', credentials=self.credentials)
        return self._service

    def get_oauth_url(self) -> str:
        """Generate OAuth authorization URL with enhanced security"""
        try:
            flow = Flow.from_client_config(
                self.client_config,
                scopes=self.SCOPES
            )
            flow.redirect_uri = os.getenv('OAUTH_REDIRECT_URI')
            
            auth_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent',
                state=os.urandom(16).hex()  # Add state parameter for security
            )
            return auth_url
        except Exception as e:
            logger.error(f"Error generating OAuth URL: {str(e)}")
            raise

    def handle_oauth_callback(self, code: str) -> Credentials:
        """Handle OAuth callback and store credentials"""
        try:
            flow = Flow.from_client_config(
                self.client_config,
                scopes=self.SCOPES,
                state=None
            )
            flow.redirect_uri = os.getenv('OAUTH_REDIRECT_URI')
            
            flow.fetch_token(code=code)
            self.credentials = flow.credentials
            self._service = None  # Reset service to force rebuild with new credentials
            return self.credentials
        except Exception as e:
            logger.error(f"Error handling OAuth callback: {str(e)}")
            raise

    @require_auth
    def create_meeting(self, 
                      summary: str = "New Meeting",
                      duration_minutes: int = 60,
                      start_time: Optional[datetime] = None,
                      attendees: Optional[list] = None,
                      description: str = "") -> Dict:
        """
        Create a Google Meet meeting with enhanced features
        
        Args:
            summary: Meeting title
            duration_minutes: Meeting duration in minutes
            start_time: Meeting start time (defaults to now)
            attendees: List of email addresses to invite
            description: Meeting description
        """
        try:
            start_time = start_time or datetime.utcnow()
            end_time = start_time + timedelta(minutes=duration_minutes)

            event = {
                'summary': summary,
                'description': description,
                'start': {
                    'dateTime': start_time.isoformat() + 'Z',
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time.isoformat() + 'Z',
                    'timeZone': 'UTC',
                },
                'conferenceData': {
                    'createRequest': {
                        'requestId': f"meet_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                        'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                    }
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 30},
                        {'method': 'popup', 'minutes': 10},
                    ]
                }
            }

            # Add attendees if provided
            if attendees:
                event['attendees'] = [{'email': email} for email in attendees]

            event = self.service.events().insert(
                calendarId='primary',
                body=event,
                conferenceDataVersion=1,
                sendUpdates='all' if attendees else 'none'
            ).execute()

            # Extract meeting details
            conference_data = event.get('conferenceData', {})
            entry_points = conference_data.get('entryPoints', [])
            meeting_url = next((ep['uri'] for ep in entry_points if ep['entryPointType'] == 'video'), None)

            return {
                'meetingUrl': meeting_url,
                'meetingId': event['id'],
                'startTime': event['start']['dateTime'],
                'endTime': event['end']['dateTime'],
                'creator': event['creator'].get('email'),
                'hangoutLink': event.get('hangoutLink'),
                'attendees': [attendee['email'] for attendee in event.get('attendees', [])]
            }

        except HttpError as e:
            error_details = json.loads(e.content).get('error', {})
            logger.error(f"Google Calendar API error: {error_details.get('message')}")
            raise
        except Exception as e:
            logger.error(f"Error creating meeting: {str(e)}")
            raise

    @require_auth
    def delete_meeting(self, event_id: str) -> bool:
        """Delete a Google Meet meeting"""
        try:
            self.service.events().delete(
                calendarId='primary',
                eventId=event_id
            ).execute()
            return True
        except Exception as e:
            logger.error(f"Error deleting meeting: {str(e)}")
            raise

    @require_auth
    def update_meeting(self, event_id: str, **kwargs) -> Dict:
        """Update an existing Google Meet meeting"""
        try:
            event = self.service.events().get(
                calendarId='primary',
                eventId=event_id
            ).execute()

            # Update fields based on kwargs
            for key, value in kwargs.items():
                if key in event:
                    event[key] = value

            updated_event = self.service.events().update(
                calendarId='primary',
                eventId=event_id,
                body=event,
                sendUpdates='all'
            ).execute()

            return {
                'meetingUrl': updated_event.get('hangoutLink'),
                'meetingId': updated_event['id'],
                'startTime': updated_event['start']['dateTime'],
                'endTime': updated_event['end']['dateTime'],
                'status': updated_event['status']
            }
        except Exception as e:
            logger.error(f"Error updating meeting: {str(e)}")
            raise

# Create a singleton instance
meet_service = GoogleMeetService()