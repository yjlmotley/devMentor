from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.ext.mutable import MutableList, MutableDict
from sqlalchemy.types import ARRAY, JSON
from sqlalchemy import DateTime, Enum
from enum import Enum as PyEnum

import datetime


db = SQLAlchemy()

    
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), unique=False, nullable=False)
    last_name = db.Column(db.String(30), unique=False, nullable=False)
    phone = db.Column(db.String(30), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(256), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False,)
    last_active = db.Column(db.DateTime(timezone=True), unique=False)
    date_joined = db.Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    about_me = db.Column(db.String(2500), unique=False)

    profile_photo = db.relationship("CustomerImage", back_populates="customer", uselist=False)
    sessions = db.relationship("Session", back_populates="customer", lazy="dynamic")

    def __repr__(self):
        return f'<Customer {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "email": self.email,
            "is_active": self.is_active,
            "last_active": self.last_active,
            "date_joined": self.date_joined,
            "profile_photo": self.profile_photo.serialize() if self.profile_photo else None,
            "about_me": self.about_me,
            "sessions": [session.id for session in self.sessions]
        }
    
class CustomerImage(db.Model):
    """Profile face image to be uploaded by the customer """

    # __table_args__ = (
    #     db.UniqueConstraint("user_username", name="unique_user_image"),
    # )
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(500), nullable=False, unique=True)
    image_url = db.Column(db.String(500), nullable=False, unique=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False, unique=True)
    customer = db.relationship("Customer", back_populates="profile_photo", uselist=False)

    def __init__(self, public_id, image_url, customer_id):
        self.public_id = public_id
        self.image_url = image_url.strip()
        self.customer_id = customer_id

    def serialize(self):
        return {
            "id": self.id,
            "image_url": self.image_url
        }
    
class Mentor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    is_active = db.Column(db.Boolean, default=True)
    last_active = db.Column(DateTime(timezone=True), unique=False)
    password = db.Column(db.String(256), unique=False, nullable=False)
    first_name = db.Column(db.String(30), unique=False, nullable=False)
    last_name = db.Column(db.String(30), unique=False, nullable=False)
    nick_name = db.Column(db.String(30), unique=False)
    phone = db.Column(db.String(30), nullable=False, index=True)
    city = db.Column(db.String(30), unique=False, nullable=False)
    what_state = db.Column(db.String(30), unique=False, nullable=False)
    country = db.Column(db.String(30), unique=False, nullable=False)
    about_me = db.Column(db.String(2500), unique=False)
    years_exp = db.Column(db.String(30), unique=False)
    skills = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=list)
    days = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=list) ## Days Avaiable 
    price = db.Column(db.Numeric(10,2), nullable=True)
    date_joined = db.Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    confirmed_sessions = db.relationship("Session", back_populates="mentor")

    profile_photo = db.relationship("MentorImage", back_populates="mentor", uselist=False)   ######
    portfolio_photos = db.relationship("PortfolioPhoto", back_populates="mentor")   ######

    def __repr__(self):
        return f'<Mentor {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "last_active": self.last_active,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "nick_name": self.nick_name,
            "phone": self.phone,
            "city": self.city,
            "what_state": self.what_state,
            "country": self.country,
            "years_exp": self.years_exp,
            "skills": [skill for skill in self.skills],
            "confirmed_sessions": [session.serialize() for session in self.confirmed_sessions] if self.confirmed_sessions else [],
            "days": [day for day in self.days],
            "profile_photo": self.profile_photo.serialize() if self.profile_photo else None,
            "portfolio_photos": [portfolio_photo.serialize() for portfolio_photo in self.portfolio_photos],
            "about_me": self.about_me,
            "price": str(self.price)
        }
    
class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=False, nullable=False)
    description = db.Column(db.String(2500), unique=False, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    is_completed = db.Column(db.Boolean, nullable=True, default=False)
    schedule = db.Column(MutableDict.as_mutable(JSON), default={})
    time_created = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    
    focus_areas = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=[])
    skills = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=[])
    resourceLink = db.Column(db.String(255))
    duration = db.Column(db.String(25), unique=False, nullable=False)
    totalHours = db.Column(db.Integer)


    messages = db.relationship("Message", back_populates="session", cascade="all, delete")

    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    customer = db.relationship("Customer", back_populates="sessions")
    
    mentor_id = db.Column(db.Integer, db.ForeignKey('mentor.id'), nullable=True)
    mentor = db.relationship("Mentor", back_populates="confirmed_sessions")

    appointments = db.Column(MutableList.as_mutable(JSON), default=[])

    def __repr__(self):
        return f'<Mentor {self.id}>'

    def serialize(self):
        return {
            "id": self.id, 
            "title": self.title,
            "description": self.description,
            "is_active": self.is_active,
            "is_completed": self.is_completed,
            "schedule": self.schedule,
            "time_created": self.time_created,
            "focus_areas": [focus_area for focus_area in self.focus_areas],
            "skills": [skill for skill in self.skills],
            "resourceLink": self.resourceLink,
            "duration": self.duration,
            "totalHours": self.totalHours,
            "customer_id": self.customer_id,
            "customer_name": f"{self.customer.first_name} {self.customer.last_name}" if self.customer else None,
            "mentor_id": self.mentor_id,
            "mentor_name": f"{self.mentor.first_name} {self.mentor.last_name}" if self.mentor else None,
            
            "mentor_photo_url": self.mentor.profile_photo.image_url if self.mentor and self.mentor.profile_photo else None,

            "mentor_price": str(self.mentor.price) if self.mentor and self.mentor.price else None,
            "messages": [ message.serialize() for message in self.messages ],
            "appointments": [
            {"start_time": app["start_time"], "end_time": app["end_time"],  "meetingUrl": app.get("meetingUrl", None)} 
            for app in self.appointments
            ]
        }

class MentorImage(db.Model):
    """Profile face image to be uploaded by the mentor for profile """

    # __table_args__ = (
    #     db.UniqueConstraint("user_username", name="unique_user_image"),
    # )
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(500), nullable=False, unique=True)
    image_url = db.Column(db.String(500), nullable=False, unique=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey("mentor.id"), nullable=False, unique=True)
    mentor = db.relationship("Mentor", back_populates="profile_photo", uselist=False)

    def __init__(self, public_id, image_url, mentor_id):
        self.public_id = public_id
        self.image_url = image_url.strip()
        self.mentor_id = mentor_id

    def serialize(self):
        return {
            "id": self.id,
            "image_url": self.image_url
        }
    
class PortfolioPhoto(db.Model):
    """Portfolio Images to be uploaded by the mentor for profile """

    # __table_args__ = (
    #     db.UniqueConstraint("user_username", name="unique_user_image"),
    # )
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(500), nullable=False, unique=True)
    image_url = db.Column(db.String(500), nullable=False, unique=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey("mentor.id"), nullable=False)
    mentor = db.relationship("Mentor", back_populates="portfolio_photos")

    def __init__(self, public_id, image_url, mentor_id):
        self.public_id = public_id
        self.image_url = image_url.strip()
        self.mentor_id = mentor_id

    def serialize(self):
        return {
            "id": self.id,
            "image_url": self.image_url
    }

class MyEnum(PyEnum):
    CUSTOMER = "customer"
    MENTOR = "mentor"

class Message(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey("session.id"), nullable=False)
    mentor_id = db.Column(db.Integer, db.ForeignKey("mentor.id"), nullable=False)
    mentor = db.relationship("Mentor", backref="messages")
    text = db.Column(db.String(500), unique=False, nullable=False)
    sender = db.Column(Enum(MyEnum), nullable=False)
    session = db.relationship("Session", back_populates="messages")
    time_created = db.Column(db.DateTime(timezone=True), server_default=db.func.now())

    def __repr__(self):
        return f'<Comment {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "mentor_id": self.mentor_id,
            "mentor_name": f"{self.mentor.first_name} {self.mentor.last_name}" if self.mentor else None,
            "text": self.text,
            "sender": self.sender.value,
            "time_created": self.time_created,
        }
