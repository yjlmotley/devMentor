"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import logging
from datetime import datetime, timedelta
import stripe

from flask import Flask, request, jsonify, url_for, Blueprint, current_app, redirect
from flask_cors import CORS
import jwt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash

import cloudinary.uploader as uploader
from cloudinary.uploader import destroy
from cloudinary.api import delete_resources_by_tag

from api.models import db, Mentor, Customer, Session, MentorImage, PortfolioPhoto, Message, MyEnum
from api.utils import generate_sitemap, APIException
from api.decorators import mentor_required, customer_required
from api.send_email import send_email
from enum import Enum as PyEnum

from .googlemeet import meet_service
from urllib.parse import urlencode


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



@api.route('/current/user')
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    role = get_jwt()['role']

    if role == 'mentor':
        mentor = Mentor.query.get(user_id)
        if mentor is None:
            return jsonify({"msg": "No user with this email exists."}), 404
        return jsonify(role = "mentor", user_data = mentor.serialize())
    
    if role == 'customer':
        customer = Customer.query.get(user_id)
        if customer is None:
            return jsonify({"msg": "No user with this email exists."}), 404
        return jsonify(role = "customer", user_data = customer.serialize())


# Mentor routes Start # Mentor routes Start # Mentor routes Start
# Mentor routes Start # Mentor routes Start # Mentor routes Start
# Mentor routes Start # Mentor routes Start # Mentor routes Start
# Mentor routes Start # Mentor routes Start # Mentor routes Start


@api.route('/mentor/signup', methods=['POST'])
def mentor_signup():

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    city = request.json.get("city", None)
    what_state = request.json.get("what_state", None)
    country = request.json.get("country", None)
    phone = request.json.get("phone", "None")

    if email is None or password is None or first_name is None or last_name is None or city is None or what_state is None or country is None or phone is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    mentor = Mentor.query.filter_by(email=email).one_or_none()
    if mentor:
        return jsonify({"msg": "An account associated with the email already exists"}), 409
    mentor = Mentor(
        email=email, 
        password=generate_password_hash(password), 
        first_name=first_name, 
        last_name=last_name, 
        city=city, 
        what_state=what_state, 
        country=country, 
        phone=phone
    )
    db.session.add(mentor)
    db.session.commit()
    db.session.refresh(mentor)
    response_body = {
        "msg": "Mentor Account successfully created!",
        "mentor":mentor.serialize()
    }
    return jsonify(response_body), 201

@api.route('/mentor/login', methods=['POST'])
def mentor_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if email is None or password is None:
        return jsonify({"msg": "Email and password are required."}), 400
    
    mentor = Mentor.query.filter_by(email=email).one_or_none()
    if mentor is None:
        return jsonify({"msg": "No user with this email exists."}), 404
    
    if not check_password_hash(mentor.password, password):
        return jsonify({"msg": "Incorrect password, please try again."}), 401

    access_token = create_access_token(
        identity=mentor.id, 
        additional_claims={"role": "mentor"},
        expires_delta=timedelta(hours=3)
    )
    return jsonify(access_token=access_token), 200

@api.route("/forgot-password", methods=["POST"])
def forgot_password():
    data=request.json
    email=data.get("email")
    # want to get user type in the same fashion as email
    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    user = Mentor.query.filter_by(email=email).first() or Customer.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "Email does not exist"}), 400
    
    expiration_time = datetime.utcnow() + timedelta(hours=3)
    token = jwt.encode({"email": email, "exp": expiration_time}, os.getenv("FLASK_APP_KEY"), algorithm="HS256")

    # /?userType = {usertype} in the email value
    email_value = f"Here is the password recovery link!\n{os.getenv('FRONTEND_URL')}/reset-password?token={token}"
    send_email(email, email_value, "Subject: Password recovery for devMentor")
    return jsonify({"message": "Recovery password email has been sent!"}), 200

@api.route("/reset-password/<token>", methods=["PUT"])
def reset_password(token):
    data = request.get_json()
    password = data.get("password")

    if not password:
        return jsonify({"message": "Please provide a new password."}), 400

    try:
        decoded_token = jwt.decode(token, os.getenv("FLASK_APP_KEY"), algorithms=["HS256"])
        email = decoded_token.get("email")
    # except Exception as e:
    #     return jsonify({"message": "Invalid or expired token."}), 400
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 400

    # email = json_secret.get('email')
    # if not email:
    #     return jsonify({"message": "Invalid token data."}), 400

    mentor = Mentor.query.filter_by(email=email).first()
    customer = Customer.query.filter_by(email=email).first()

    user = Mentor.query.filter_by(email=email).first() or Customer.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email does not exist"}), 400

    # user.password = hashlib.sha256(password.encode()).hexdigest()
    user.password = generate_password_hash(password)
    db.session.commit()

    send_email(email, "Your password has been changed successfully.", "Password Change Notification")

    return jsonify({
        "message": "Password successfully changed.", 
        "role": "mentor" if mentor else "customer" if customer else None
    }), 200


@api.route("/change-password", methods=["PUT"])
@jwt_required()  # This ensures that the request includes a valid JWT token
def change_password():
    data = request.json
    password = data.get("password")
    if not password:
        return jsonify({"message": "Please provide a new password."}), 400
    
    try:
        # This will now work because @jwt_required() has validated the token
        user_id = get_jwt_identity()
        print(f"Decoded JWT Identity: {user_id}")

        user = Mentor.query.get(user_id) or Customer.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        user.password = generate_password_hash(password)
        db.session.commit()
        
        # Send an email notification after the password has been changed
        email_body = "Your password has been changed successfully. If you did not request this change, please contact support."
        send_email(user.email, email_body, "Password Change Notification")

        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        print(f"Token decryption failed: {str(e)}")
        logging.error(f"Error changing password: {str(e)}")
        return jsonify({"message": "An error occurred. Please try again later."}), 500

@api.route('/mentors', methods=['GET'])
def all_mentors():
   mentors = Mentor.query.all()
   return jsonify([mentor.serialize() for mentor in mentors]), 200

@api.route('/mentorsnosession', methods=['GET'])
def all_mentors_no_sessions():
    mentors = Mentor.query.all()
    serialized_mentors = [mentor.serialize() for mentor in mentors]
    # Remove confirmed_sessions from each mentor's data
    for mentor in serialized_mentors:
        mentor.pop('confirmed_sessions', None)
    return jsonify(serialized_mentors), 200

@api.route('/mentor', methods=['GET'])
@mentor_required
def mentor_by_id():
    mentor_id = get_jwt_identity()
    mentor = Mentor.query.get(mentor_id)
    if mentor is None:
        return jsonify({"msg": "No mentor found"}), 404

    return jsonify(mentor.serialize()), 200

@api.route('/mentor/edit-self', methods={'PUT'})
@mentor_required
def mentor_edit_self():
    email = request.json.get("email")
    is_active = request.json.get("is_active")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    nick_name = request.json.get("nick_name")
    phone = request.json.get("phone")
    city = request.json.get("city")
    what_state = request.json.get("what_state")
    country = request.json.get("country")
    years_exp = request.json.get("years_exp")
    skills = request.json.get("skills")
    days = request.json.get("days")
    price = request.json.get("price")
    about_me = request.json.get("about_me")
    
    if email is None or first_name is None or last_name is None or city is None or what_state is None or country is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    mentor =  Mentor.query.filter_by(id=get_jwt_identity()).first()
    if mentor is None:
        return jsonify({"msg": "No mentor found"}), 404
    
    mentor.email=email
    mentor.is_active=is_active
    mentor.first_name=first_name
    mentor.last_name=last_name
    mentor.nick_name=nick_name
    mentor.phone=phone
    mentor.city=city    
    mentor.what_state=what_state
    mentor.country=country
    mentor.years_exp=years_exp
    mentor.skills=skills
    mentor.days=days
    mentor.price=price
    mentor.about_me=about_me

    db.session.commit()
    db.session.refresh(mentor)

    response_body = {"msg": "Mentor Account sucessfully edited",
    "mentor":mentor.serialize()
    }
    return jsonify(response_body, 201)

@api.route('/mentor/upload-photo', methods =['POST'])
@mentor_required
def mentor_upload_photo():

    mentor =  Mentor.query.get(get_jwt_identity())
    if mentor is None:
        return jsonify({"msg": "No mentor found"}), 404

    images = request.files.getlist("file")
    mentor_img=MentorImage.query.filter_by(mentor_id=mentor.id).all()
    for image_file in images:
        response = uploader.upload(image_file)
        print(response)
        if len(mentor_img) == 1:
            print(f"{response.items()}")
            mentor_img[0].image_url=response['secure_url']
            uploader.destroy(mentor_img[0].public_id)
            mentor_img[0].public_id=response['public_id']
            db.session.commit()
        if len(mentor_img) == 0:
            new_image = MentorImage(public_id=response["public_id"], image_url=response["secure_url"],mentor_id=mentor.id)
            db.session.add(new_image)
            db.session.commit()

    return jsonify ({"Msg": "Image Sucessfully Uploaded"})

@api.route('/mentor/delete-photo', methods =['DELETE'])
@mentor_required
def mentor_delete_photo():
    mentor =  Mentor.query.get(get_jwt_identity())

    mentor_img=MentorImage.query.filter_by(mentor_id=get_jwt_identity()).first()
    uploader.destroy(mentor_img.public_id)
    db.session.delete(mentor_img)
    db.session.commit()

    return jsonify ({"Msg": "Image Sucessfully Deleted", "mentor": mentor.serialize()})


@api.route('/mentor/upload-portfolio-image', methods =['POST'])
@mentor_required
def mentor_upload_portfolio():

    mentor =  Mentor.query.filter_by(id=get_jwt_identity()).first()
    if mentor is None:
        return jsonify({"msg": "No mentor found"}), 404

    images = request.files.getlist("file")
    print(images)
    for image_file in images:
        response = uploader.upload(image_file)
        if response["secure_url"] is None:
            return jsonify({"Msg": "An error occured while uploading 1 or more images"}), 500
        print(f"{response.items()}")
        new_image = PortfolioPhoto(public_id=response["public_id"], image_url=response["secure_url"],mentor_id=mentor.id)
        db.session.add(new_image)
        db.session.commit()
        db.session.refresh(mentor)

    return jsonify ({"Msg": "Image Sucessfully Uploaded"})

@api.route('/mentor/delete/<int:cust_id>', methods =['DELETE'])
def delete_mentor(cust_id):
    mentor = Mentor.query.get(cust_id)
    if mentor is None:
        return jsonify({"msg": "mentor not found" }), 404
    
    # picture_public_ids = [image.image_url.split("/")[-1].split(".")[0] for image in work_order.images]

    # for public_id in picture_public_ids:
    #     delete_response = destroy(public_id)
    #     if delete_response.get("result") != "ok":
    #         print(f"Failed to delete picture with public ID: {public_id}")

    db.session.delete(mentor)
    db.session.commit()
    return jsonify({"msg": "mentor successfully deleted"}), 200


def get_mentor_id_from_token(token):
    try: 
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms = ['HS256'])
        print(f"Token payload: {payload}")
        return payload.get("mentor_id") or payload['sub']
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid Token: {e}")
        return None
    except KeyError: 
        print("mentor_id key not found")
        return None

@api.route('/mentor/deactivate', methods=['PUT'])
def deactivate_mentor():
    token = request.headers.get('Authorization').split()[1]
    mentor_id = get_mentor_id_from_token(token)
    if not mentor_id: 
        return jsonify({"msg": "invalid token"}), 401
    mentor = Mentor.query.get(mentor_id)
    if mentor:
        mentor.is_active = False
        db.session.commit()
        return jsonify({"msg": "Account deactivated successfully"}), 200
    else:
        return jsonify({"msg": "Mentor not found"}), 404

@api.route('/mentor/reactivate', methods=['PUT'])
def reactivate_mentor():
    token = request.headers.get('Authorization').split()[1]
    mentor_id = get_mentor_id_from_token(token)
    if not mentor_id: 
        return jsonify({"msg": "invalid token"}), 401
    mentor = Mentor.query.get(mentor_id)
    if mentor:
        mentor.is_active = True
        db.session.commit()
        return jsonify({"msg": "Account reactivated successfully"}), 200
    else:
        return jsonify({"msg": "Mentor not found"}), 404
    
# except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"msg": "Internal server error"}), 500


# Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start
# Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start
# Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start
# Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start # Customer Routes Start

@api.route('/customers', methods=['GET'])
def all_customers():
   customers = Customer.query.all()
   return jsonify([customer.serialize() for customer in customers]), 200

# @api.route('/customer/<int:cust_id>', methods=['GET'])
# # @mentor_required()
# def customer_by_id(cust_id):
#     # current_user_id = get_jwt_identity()
#     # current_user = User.query.get(current_user_id)

#     customer = Customer.query.get(cust_id)
#     if customer is None:
#         return jsonify({"msg": "No customer found"}), 404
    
#     return jsonify(customer.serialize()), 200

@api.route('/customer/login', methods=['POST'])
def customer_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "No email or password"}), 400
    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer is None:
        return jsonify({"msg": "no such user"}), 404
    if customer.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(
        identity=customer.id,
        additional_claims = {"role": "customer"} 
        )
    return jsonify(access_token=access_token), 201

@api.route('/customer/signup', methods=['POST'])
def customer_signup():
   
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    city = request.json.get("city", None)
    what_state = request.json.get("what_state",None)
    country = request.json.get("country",None)
    phone = request.json.get("phone", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    
    if first_name is None or last_name is None or city is None or what_state is None or country is None or phone is None or email is None or password is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer:
        return jsonify({"msg": "An account associated with the email already exists"}), 409
    customer = Customer(first_name=first_name, last_name=last_name, city=city, what_state=what_state, country=country, phone=phone, email=email, password=password)
    db.session.add(customer)
    db.session.commit()
    db.session.refresh(customer)
    response_body = {"msg": "Account succesfully created!", "customer":customer.serialize()}
    return jsonify(response_body), 201

@api.route('/customer/edit-self', methods=['PUT'])
@customer_required
def handle_customer_edit_by_customer():
    email = request.json.get("email")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    city = request.json.get("city")
    what_state = request.json.get("what_state",None)
    country = request.json.get("country",None)
    phone = request.json.get("phone")
    
    if email is None or first_name is None or last_name is None or city is None or what_state is None is None or country is None or phone is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
   
    customer = Customer.query.filter_by(id=get_jwt_identity()).first()
    if customer is None:
        return jsonify({"msg": "No customer found"}), 404
    
    customer.email=email 
    customer.first_name=first_name   
    customer.last_name=last_name 
    customer.city=city    
    customer.what_state=what_state    
    customer.country=country    
    customer.phone=phone
    db.session.commit()
    db.session.refresh(customer)
    
    response_body = {"msg": "Account succesfully edited!", "customer":customer.serialize()}
    return jsonify(response_body), 201

@api.route('/current-customer', methods=['GET'])
@jwt_required()
def get_current_customer():
    
    customer = Customer.query.get(get_jwt_identity())
    if customer is None:
        return jsonify({"msg": "No customer found"}), 404
    
    return jsonify(customer.serialize()), 200

@api.route('/customer/delete/<int:cust_id>', methods =['DELETE'])
def delete_customer(cust_id):
    customer = Customer.query.get(cust_id)
    if customer is None:
        return jsonify({"msg": "work order not found" }), 404
    
    # picture_public_ids = [image.image_url.split("/")[-1].split(".")[0] for image in work_order.images]

    # for public_id in picture_public_ids:
    #     delete_response = destroy(public_id)
    #     if delete_response.get("result") != "ok":
    #         print(f"Failed to delete picture with public ID: {public_id}")

    db.session.delete(customer)
    db.session.commit()
    return jsonify({"msg": "customer successfully deleted"}), 200


    

# Session Routes Start Session Routes Start Session Routes Start Session Routes Start
# Session Routes Start Session Routes Start Session Routes Start Session Routes Start
# Session Routes Start Session Routes Start Session Routes Start Session Routes Start
# Session Routes Start Session Routes Start Session Routes Start Session Routes Start

@api.route('/sessions', methods= ['GET'])
def all_sessions():
    sessions = Session.query.all()
    return jsonify([session.serialize() for session in sessions]), 200

@api.route('/session/<int:session_id>', methods=["GET"])
@customer_required
def session_by_id(session_id):

    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "No session found"}), 404
    
    return jsonify(session.serialize()), 200

@api.route('/session/create', methods=['POST'])
def create_session():
    customer_id = request.json.get("customer_id")
    title = request.json.get("title", None)
    description = request.json.get("description", None)
    is_active = request.json.get("is_active", None)
    schedule = request.json.get("schedule", None)
    focus_areas = request.json.get("focus_areas", None)
    skills = request.json.get("skills", None)
    resourceLink = request.json.get("resourceLink", None)
    duration = request.json.get("duration", None)
    totalHours = request.json.get("totalHours", None)
    
    missing_fields = [f for f, v in locals().items() if f in ["customer_id","title", "description", "is_active", "schedule", "focus_areas", "skills", "resourceLink", "duration", "totalHours"] and v is None]

    if missing_fields:
        return jsonify({"msg": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Validate data types
    if not isinstance(skills, list):
        return jsonify({"msg": "Skills must be a list"}), 400

    if not isinstance(schedule, dict):
        return jsonify({"msg": "Schedule must be a dictionary"}), 400

    # Validate schedule structure
    for day, times in schedule.items():
        if not isinstance(times, dict) or 'start' not in times or 'end' not in times:
            return jsonify({"msg": f"Invalid schedule format for {day}"}), 400

    # Create and save the new session
    session = Session(
        customer_id=customer_id,
        title=title,
        description=description,
        is_active=is_active,
        schedule=schedule,
        focus_areas=focus_areas,
        skills=skills,
        resourceLink=resourceLink,
        duration=duration,
        totalHours=totalHours
    )
    db.session.add(session)
    db.session.commit()
    
    # Get the new session ID and include it in both the top level and session object
    response_body = {
        "msg": "Session successfully created!",
        "session_id": session.id,  # Include ID at top level
        "session": session.serialize()  # This also includes the ID
    }
    return jsonify(response_body), 201

@api.route('/session/edit/<int:session_id>', methods=['PUT'])
def edit_session(session_id):
    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "No session found"}), 404

    # Extract input data
    title = request.json.get("title")
    description = request.json.get("description")
    is_active = request.json.get("is_active")
    schedule = request.json.get("schedule")
    focus_areas = request.json.get("focus_areas")
    skills = request.json.get("skills")
    resourceLink = request.json.get("resourceLink")
    duration = request.json.get("duration")
    totalHours = request.json.get("totalHours")

    # Check for missing fields
    missing_fields = [f for f, v in locals().items() if f in ["title", "description", "is_active", "schedule", "focus_areas", "skills", "resourceLink", "duration", "totalHours"] and v is None]

    if missing_fields:
        return jsonify({"msg": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Validate data types
    if not isinstance(skills, list):
        return jsonify({"msg": "Skills must be a list"}), 400

    if not isinstance(schedule, dict):
        return jsonify({"msg": "Schedule must be a dictionary"}), 400

    # Validate schedule structure
    for day, times in schedule.items():
        if not isinstance(times, dict) or 'start' not in times or 'end' not in times:
            return jsonify({"msg": f"Invalid schedule format for {day}"}), 400

    # Update the session
    session.title = title
    session.description = description
    session.is_active = is_active
    session.schedule = schedule
    session.focus_areas = focus_areas
    session.skills = skills
    session.resourceLink = resourceLink
    session.duration = duration
    session.totalHours = totalHours

    db.session.commit()
    db.session.refresh(session)

    response_body = {
        "msg": "Session successfully edited!",
        "session": session.serialize()
    }
    return jsonify(response_body), 200

@api.route('/session/complete/<int:session_id>', methods=['PUT'])
def complete_session(session_id):
    session = Session.query.get(session_id)
    
    if session is None:
        return jsonify({"msg": "No session found"}), 404
    
    is_completed = request.json.get("is_completed")
    
    if is_completed is None:
        return jsonify({"msg": "Missing field: is_completed"}), 400
        
    if not isinstance(is_completed, bool):
        return jsonify({"msg": "is_completed must be a boolean value"}), 400
    
    session.is_completed = is_completed
    
    db.session.commit()
    db.session.refresh(session)
    
    response_body = {
        "msg": "Session completion status updated successfully!",
        "session": session.serialize()
    }
    return jsonify(response_body), 200
    
@api.route('/session/delete/<int:session_id>', methods =["DELETE"])
def delete_session(session_id):

    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "No session found"}), 404

    db.session.delete(session)
    db.session.commit()
    return jsonify({"msg": "Session Sucessfully Deleted"}), 200

@api.route('/sessions/customer', methods=['GET'])
@customer_required
def get_sessions_by_customer_id():
    cust_id = get_jwt_identity()
    print(f"Customer ID from JWT: {cust_id}")

    customer = Customer.query.get(cust_id)
    if not customer:
        return jsonify({"msg": "Customer not found"}), 404
    
    sessions = [session.serialize() for session in customer.sessions]
    # for session in sessions:
    #     mentor = Mentor.query.get(session.mentor_id)
    #     session["mentor_image_url"] = mentor.profile_photo.image_url
    

    return jsonify(sessions), 200

@api.route('/session/confirm/<int:session_id>', methods=['GET'])
@customer_required
def confirm_mentor(session_id):
    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "No session found"}), 404
    
@api.route('/session/<int:session_id>/confirm-mentor/<int:mentor_id>', methods=['PUT'])
@customer_required
def confirm_mentor_for_session(session_id, mentor_id):
    customer_id = get_jwt_identity()

    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "No session found"}), 404

    if session.customer_id != customer_id:
        return jsonify({"msg": "You are not authorized to modify this session"}), 403

    mentor = Mentor.query.get(mentor_id)
    if mentor is None:
        return jsonify({"msg": "No mentor found"}), 404

    # Confirm mentor for session
    session.mentor_id = mentor_id
    session.is_active = False  # Marking the session as inactive once a mentor is confirmed

    # Add an appointment
    # Assuming the request includes start_time and end_time in the JSON body
    data = request.get_json()
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    if start_time and end_time:
        new_appointment = {
            "start_time": start_time,
            "end_time": end_time
        }
        if session.appointments is None:
            session.appointments = []
        session.appointments.append(new_appointment)
    else:
        return jsonify({"msg": "Start time and end time are required for the appointment"}), 400

    db.session.commit()
    db.session.refresh(session)

    response_body = {
        "msg": "Mentor successfully confirmed for session and appointment added!",
        "session": session.serialize()
    }
    return jsonify(response_body), 200
    

# Message routes Start # Message routes Start # Message routes Start
# Message routes Start # Message routes Start # Message routes Start
# Message routes Start # Message routes Start # Message routes Start
# Message routes Start # Message routes Start # Message routes Start

@api.route('/message-mentor', methods=['POST'])
@mentor_required
def create_message_mentor():
    session_id = request.json.get("session_id")
    text = request.json.get("text")
    
    if None in [session_id, text]:
        return jsonify({"msg": "Some fields are missing in your request"}), 400

    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "Session not found"}), 404

    mentor = Mentor.query.get(get_jwt_identity())
    if mentor is None:
        return jsonify({"msg": "Mentor not found"}), 404

    # Create and save the new message
    message = Message(
        session_id=session_id,
        mentor_id=mentor.id,
        text=text,
        sender=MyEnum("mentor")
    )
    db.session.add(message)
    db.session.commit()

    # Serialize the message, ensuring MyEnum is converted to a string
    serialized_message = message.serialize()
    # serialized_message['sender'] = serialized_message['sender'].value

    response_body = {
        "msg": "Message successfully created!",
        "message": serialized_message
    }
    return jsonify(response_body), 201

@api.route('/message-customer', methods=['POST'])
@customer_required
def create_message_customer():
    session_id = request.json.get("session_id")
    text = request.json.get("text")
    mentor_id = request.json.get("mentor_id")

    if None in [session_id, text, mentor_id]:
        return jsonify({"msg": "Some fields are missing in your request"}), 400

    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "Session not found"}), 404

    customer = Customer.query.get(get_jwt_identity())
    if customer is None or customer.id != session.customer_id:
        return jsonify({"msg": "You are not authorized for this session"}), 403

    mentor = Mentor.query.get(mentor_id)
    if mentor is None:
        return jsonify({"msg": "Mentor not found"}), 404

    message = Message(
        session_id=session_id,
        mentor_id=mentor_id,
        text=text,
        sender=MyEnum("customer")
    )
    db.session.add(message)
    db.session.commit()

    serialized_message = message.serialize()

    response_body = {
        "msg": "Message successfully created!",
        "message": serialized_message
    }
    return jsonify(response_body), 201

@api.route('/messages/<int:session_id>', methods=['GET'])
@jwt_required()
def get_messages(session_id):
    messages = Message.query.filter_by(session_id=session_id).order_by(Message.time_created).all()
    
    if not messages:
        return jsonify({"msg": "No messages found for this session"}), 404

    return jsonify([message.serialize() for message in messages]), 200


# Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes 
# Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes 
# Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes 
# Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes Google Meet Routes



@api.route('/meet/auth', methods=['GET'])
def start_oauth():
    try:
        auth_url = meet_service.get_oauth_url()
        return jsonify({'authUrl': auth_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    

@api.route('/meet/oauth-callback', methods=['GET'])
def oauth_callback():
    code = request.args.get('code')
    if not code:
        frontend_url = os.getenv('AFTER_AUTH_URL')
        error_params = urlencode({'error': 'No authorization code received'})
        return redirect(f"{frontend_url}?{error_params}")

    try:
        credentials = meet_service.handle_oauth_callback(code)
        # Save credentials in session or database if needed
        
        # Redirect to frontend with success parameter
        frontend_url = os.getenv('AFTER_AUTH_URL')
        success_params = urlencode({'auth': 'success'})
        return redirect(f"{frontend_url}?{success_params}")
    except Exception as e:
        frontend_url = os.getenv('AFTER_AUTH_URL')
        error_params = urlencode({'error': str(e)})
        return redirect(f"{frontend_url}?{error_params}")

@api.route('/meet/create-meeting', methods=['POST'])
def create_meeting():
    try:
        meeting_data = meet_service.create_meeting()
        return jsonify(meeting_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a new endpoint to fetch meetings
@api.route('/meet/meetings', methods=['GET'])
def get_meetings():
    try:
        meetings = meet_service.get_meetings()  # You'll need to implement this in your meet_service
        return jsonify(meetings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Stripe routes Start # Stripe routes Start # Stripe routes Start
# Stripe routes Start # Stripe routes Start # Stripe routes Start
# Stripe routes Start # Stripe routes Start # Stripe routes Start
# Stripe routes Start # Stripe routes Start # Stripe routes Start

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@api.route('/create-payment-intent', methods=['OPTIONS', 'POST'])
def create_payment_intent():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        intent = stripe.PaymentIntent.create(
            amount=data['amount'],  # amount in cents
            currency='usd',
            metadata={'integration_check': 'accept_a_payment'},
        )
        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403

@api.route('/payout', methods=['POST'])
@jwt_required() 
def create_payout():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()


        # Here you would typically look up the Stripe account ID for the current user
        # This is just an example - replace with your actual logic
        # provider_stripe_account = get_provider_stripe_account(current_user_id)

        # Create a transfer to the connected account
        payout = stripe.Payout.create(
            amount=data['amount'],  # amount in cents
            currency='usd',
            # stripe_account="acct_1Q18mE2ZAO1b3fPQ"
            # stripe_account="acct_1QIydjIKKqBcu9li" #regular stripe acc
            stripe_account="acct_1QIyvyIurh11jVin" #sandbox stripe acc
            
            # stripe_account=data['providerId']  # Stripe Account ID of the provider
            # stripe_account=provider_stripe_account
        )

        return jsonify({
            'success': True,
            'payoutId': payout.id
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 403

# def get_provider_stripe_account(user_id):
    # This is a placeholder function
    # Implement the logic to retrieve the Stripe account ID for the given user
    # This might involve a database lookup or an API call to your user management system
    # pass

# --------------------------testing---------------
# @api.route('/payout', methods=['POST'])
# def create_payout():
#     try:
#         data = request.get_json()
#         amount = data.get('amount')
#         provider_id = data.get('providerId')

#         if not amount or not provider_id:
#             return jsonify({
#                 'success': False,
#                 'error': 'Missing required fields: amount and providerId'
#             }), 400

#         if provider_id == "test_provider_id":
#             # For testing purposes, we'll simulate a successful payout
#             return jsonify({
#                 'success': True,
#                 'payoutId': 'test_payout_id_12345',
#                 'message': 'This is a simulated successful payout for testing purposes.'
#             })

#         # In a real scenario, you would use the actual Stripe payout here
#         # payout = stripe.Payout.create(
#         #     amount=amount,
#         #     currency='usd',
#         #     stripe_account=provider_id
#         # )

#         # return jsonify({
#         #     'success': True,
#         #     'payoutId': payout.id
#         # })

#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500
# --------------------testing------------------------