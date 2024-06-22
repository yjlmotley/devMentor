# decorators.py
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def mentor_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if claims.get("role") == "mentor":
            return fn(*args, **kwargs)
        else:
            return jsonify(msg="Mentors only!"), 403
    return wrapper

def customer_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if claims.get("role") == "customer":
            return fn(*args, **kwargs)
        else:
            return jsonify(msg="Customers only!"), 403
    return wrapper
