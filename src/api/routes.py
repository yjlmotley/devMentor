"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, Mentor, Customer, Session
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.decorators import mentor_required, customer_required
import jwt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200

# Mentor routes Start # Mentor routes Start # Mentor routes Start
# Mentor routes Start # Mentor routes Start # Mentor routes Start
# Mentor routes Start # Mentor routes Start # Mentor routes Start
# Mentor routes Start # Mentor routes Start # Mentor routes Start

@api.route('/mentors', methods=['GET'])
def all_mentors():
   mentors = Mentor.query.all()
   return jsonify([mentor.serialize() for mentor in mentors]), 200

@api.route('/mentor/login', methods=['POST'])
def mentor_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "No email or password"}), 400
    mentor = Mentor.query.filter_by(email=email).one_or_none()
    if mentor is None:
        return jsonify({"msg": "no such user"}), 404
    if mentor.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(
        identity=mentor.id,
        additional_claims = {"role": "mentor"} 
        )
    return jsonify(access_token=access_token), 201



@api.route('/mentor', methods=['GET'])
@mentor_required
def mentor_by_id():
    mentor_id = get_jwt_identity()
    mentor = Mentor.query.get(mentor_id)
    if mentor is None:
        return jsonify({"msg": "No mentor found"}), 404

    return jsonify(mentor.serialize()), 200

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
    mentor = Mentor(email=email, password=password, first_name=first_name, last_name=last_name, city=city, what_state=what_state, country=country, phone=phone)
    db.session.add(mentor)
    db.session.commit()
    db.session.refresh(mentor)
    response_body = {"msg": "Mentor Account successfully created!",
    "mentor":mentor.serialize()}
    return jsonify(response_body), 201

@api.route('/mentor/edit-self', methods={'PUT'})
@mentor_required
def mentor_edit_self():
    email = request.json.get("email")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    nick_name = request.json.get("nick_name")
    phone = request.json.get("phone")
    city = request.json.get("city")
    what_state = request.json.get("what_state")
    country = request.json.get("country")
    years_exp = request.json.get("years_exp")
    skills = request.json.get("skills")
    past_sessions = request.json.get("past_sessions")
    days = request.json.get("days")
    price = request.json.get("price")
    about_me = request.json.get("about_me")
    
    if email is None or first_name is None or last_name is None or city is None or what_state is None or country is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    mentor =  Mentor.query.filter_by(id=get_jwt_identity()).first()
    if mentor is None:
        return jsonify({"msg": "No mentor found"}), 404
    
    mentor.email=email
    mentor.first_name=first_name
    mentor.last_name=last_name
    mentor.nick_name=nick_name
    mentor.phone=phone
    mentor.city=city    
    mentor.what_state=what_state
    mentor.country=country
    mentor.years_exp=years_exp
    mentor.skills=skills
    mentor.past_sessions=past_sessions
    mentor.days=days
    mentor.price=price
    mentor.about_me=about_me
    db.session.commit()
    db.session.refresh(mentor)

    response_body = {"msg": "Mentor Account sucessfully edited",
    "mentor":mentor.serialize()}
    return jsonify(response_body, 201)

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

@api.route('/customer/<int:cust_id>', methods=['GET'])
# @mentor_required()
def customer_by_id(cust_id):
    # current_user_id = get_jwt_identity()
    # current_user = User.query.get(current_user_id)

    customer = Customer.query.get(cust_id)
    if customer is None:
        return jsonify({"msg": "No customer found"}), 404
    
    return jsonify(customer.serialize()), 200

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
    address = request.json.get("address", None)
    phone = request.json.get("phone", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    
    if first_name is None or last_name is None or phone is None or email is None or password is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer:
        return jsonify({"msg": "An account associated with the email already exists"}), 409
    customer = Customer(first_name=first_name, last_name=last_name, address=address, phone=phone, email=email, password=password)
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
    address = request.json.get("address")
    phone = request.json.get("phone")
    
    if email is None or first_name is None or last_name is None or address is None or phone is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
   
    customer = Customer.query.filter_by(id=get_jwt_identity()).first()
    if customer is None:
        return jsonify({"msg": "No customer found"}), 404
    
    customer.email=email 
    customer.first_name=first_name   
    customer.last_name=last_name 
    customer.address=address    
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

# Session Routes Start

@api.route('/sessions', methods= ['GET'])
def all_sessions():
    sessions = Session.query.all()
    return jsonify([session.serialize() for session in sessions]), 200

@api.route('/session/<int:session_id>', methods=["GET"])
def session_by_id(session_id):

    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "No session found"}), 404
    
    return jsonify(session.serialize()), 200

@api.route('/session/create', methods=['POST'])
def create_session():

    title = request.json.get("title", None)
    details = request.json.get("details", None)
    skills = request.json.get("skills", None)
    hours_needed = request.json.get("hours_needed", None)
    days = request.json.get("days", None) 

    if title is None or details is None or skills is None or hours_needed is None or days is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    session = Session(title=title, details=details, skills=skills, hours_needed=hours_needed, days=days)
    db.session.add(session)
    db.session.commit()
    db.session.refresh(session)
    response_body = {"msg": "Session successfully created!", "session":session.serialize()}
    return jsonify(response_body), 201

@api.route('/session/edit/<int:session_id>', methods=['PUT'])
def edit_session(session_id):

    session = Session.query.get(session_id)
    if session is None:
        return jsonify({"msg": "no session found"}), 404

    title = request.json.get("title")
    details = request.json.get("details")
    skills = request.json.get("skills")
    hours_needed = request.json.get("hours_needed")
    days = request.json.get("days")

    if title is None or details is None or skills is None or hours_needed is None or days is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    session.title=title
    session.details=details
    session.skills=skills
    session.hours_needed=hours_needed
    session.days=days
    db.session.commit()
    db.session.refresh(session)

    response_body = {"msg": "Mentor Session succesfully edited!", "session":session.serialize()}
    return jsonify(response_body), 200
    
@api.route('/session/delete/<int:sess_id>', methods =["DELETE"])
def delete_session(sess_id):

    session = Session.query.get(sess_id)
    if session is None:
        return jsonify({"msg": "No session found"}), 404

    db.session.delete(session)
    db.session.commit()
    return jsonify({"msg": "Session Sucessfully Deleted"}), 200

