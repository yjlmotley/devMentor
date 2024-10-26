"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
import logging
from werkzeug.middleware.proxy_fix import ProxyFix

import cloudinary
import cloudinary.uploader as uploader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ENV = os.getenv("FLASK_ENV", "development")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Handle proxy headers from Render
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get("FLASK_APP_KEY", "sample key")
app.config["JWT_ALGORITHM"] = "HS256"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 24 * 60 * 60
jwt = JWTManager(app)

# File Upload Configuration
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER')
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # Increased to 10MB
app.config['CLOUDINARY_URL'] = os.environ.get("CLOUDINARY_URL")

# Initialize Cloudinary
try:
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )
except Exception as e:
    logger.error(f"Cloudinary configuration error: {str(e)}")

# Database Configuration
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# CORS Configuration
cors = CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://devmentor-1.onrender.com",
            "http://localhost:3000",
            "http://localhost:3001"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 600  # Cache preflight requests for 10 minutes
    }
})

# Error Handling for CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        headers = request.headers.get('Access-Control-Request-Headers')
        if headers:
            response.headers['Access-Control-Allow-Headers'] = headers
    return response

# Setup admin and commands
setup_admin(app)
setup_commands(app)

# Register API blueprint
app.register_blueprint(api, url_prefix='/api')

# Error Handlers
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    logger.error(f"API Exception: {str(error)}")
    return jsonify(error.to_dict()), error.status_code

@app.errorhandler(413)
def request_entity_too_large(error):
    logger.error("File too large error")
    return jsonify({"error": "File too large. Maximum size is 10MB"}), 413

@app.errorhandler(500)
def internal_server_error(error):
    logger.error(f"Internal Server Error: {str(error)}")
    return jsonify({"error": "Internal Server Error"}), 500

# Routes
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route('/submit', methods=['POST'])
def submit():
    try:
        # Retrieve form data
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']
        phone_number = request.form['phone_number']
        vin_number = request.form['vin_number']
        license_plate = request.form['license_plate']
        text_area = request.form['text_area']

        # Process the form data here
        logger.info(f"Form submitted for {first_name} {last_name}")

        return jsonify({'message': 'Form submitted successfully'})
    except Exception as e:
        logger.error(f"Form submission error: {str(e)}")
        return jsonify({'error': 'Form submission failed'}), 400

# Main execution
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=ENV == "development")