from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.types import ARRAY

db = SQLAlchemy()

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    date_joined = db.Column(db.DateTime(timezone=True, server_default=db.func.now()))

    def __repr__(self):
        return f'<Admin {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
        }
    
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    date_joined = db.Column(db.DateTime(timezone=True, server_default=db.func.now()))

    def __repr__(self):
        return f'<Customer {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
        }
    
class Mentor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    last_active = db.Column(db.Boolean(), unique=False, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    first_name = db.Column(db.String(30), unique=False, nullable=False)
    last_name = db.Column(db.String(30), unique=False, nullable=False)
    nick_name = db.Column(db.String(30), unique=False)
    city = db.Column(db.String(30), unique=False, nullable=False)
    state = db.Column(db.String(30), unique=False, nullable=False)
    country = db.Column(db.String(30), unique=False, nullable=False)
    years_exp = db.Column(db.String(30), unique=False)
    skills = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=list)
    past_sessions = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=[])
    days = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=list) ## Days Avaiable 
    price = db.Column(db.Integer)
    

    profile_photo = db.relationship("MentorImage", back_populates="mentor")   ######
    portfolio_photos = db.relationship("PortfolioPhoto", back_populates="mentor")   ######
    # ratings = 
    about_me = db.Column(db.String(2500), unique=False)
    
    
    date_joined = db.Column(db.DateTime(timezone=True, server_default=db.func.now()))

    def __repr__(self):
        return f'<Mentor {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "last_active": self.last_active,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "nick_name": self.nick_name,
            "city": self.city,
            "state": self.state,
            "country": self.country,
            "years_exp": self.years_exp,
            "skills": [skill for skill in self.skills],
            "past_sessions": [past_session for past_session in self.past_sessions],
            "days": [day for day in self.days],
            "profile_photo": self.profile_photos[0].serialize() if self.profile_photos else None,
            "portfolio_photos": [portfolio_photo.serialize() for portfolio_photo in self.portfolio_photos],
            "about_me": self.about_me,
            "price": self.price
        }
    
class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(30), unique=False, nullable=False)
    details = db.Column(db.String(2500), unique=False, nullable=False)
    skills = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=[])
    hours_needed = db.Column(db.Integer, unique=False, nullable=False)
    days = db.Column(MutableList.as_mutable(ARRAY(db.String(255))), default=[])

    def __repr__(self):
        return f'<Mentor {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "details": self.details,
            "skills": [skill for skill in self.skills],
            "hours_needed": self.hours_needed,
            "days": [day for day in self.days]
        }

class MentorImage(db.Model):
    """Profile face image to be uploaded by the mentor for profile """

    # __table_args__ = (
    #     db.UniqueConstraint("user_username", name="unique_user_image"),
    # )
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(500), nullable=False, unique=True)
    image_url = db.Column(db.String(500), nullable=False, unique=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey("mentor.id"), nullable=False)
    mentor = db.relationship("mentor", back_populates="profile_photo")

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
portfolio_photo = db.relationship("mentor", back_populates="portfolio_photos")

def __init__(self, public_id, image_url, mentor_id):
    self.public_id = public_id
    self.image_url = image_url.strip()
    self.mentor_id = mentor_id

def serialize(self):
    return {
        "id": self.id,
        "image_url": self.image_url
    }