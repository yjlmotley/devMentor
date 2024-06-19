from functools import wraps
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Customer
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") == "owner":
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Admins only!"), 403

        return decorator

    return wrapper