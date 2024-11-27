"""
This module initializes the Flask API server, database, and endpoints.
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# Environment Configuration
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# Flask App Initialization
app = Flask(__name__)
app.url_map.strict_slashes = False

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 7 * 24 * 60 * 60 * 52  # 1 year
jwt = JWTManager(app)

# CORS Configuration
allowed_origins = [
    "https://devmentor-frontend.onrender.com",
    "https://devmentorbackend.onrender.com"
]
CORS(app, resources={r"/api/*": {
    "origins": allowed_origins,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Cloudinary Configuration
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024
app.config['CLOUDINARY_URL'] = os.getenv("CLOUDINARY_URL", "")

# Database Configuration
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Admin and Commands Setup
setup_admin(app)
setup_commands(app)

# API Blueprint Registration
app.register_blueprint(api, url_prefix='/api')

# Error Handling
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Sitemap Generation
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Static File Serving
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Avoid cache memory
    return response

# Example Form Submission Endpoint (if required)
@app.route('/submit', methods=['POST'])
def submit():
    # Retrieve and process form data
    data = {key: request.form.get(key) for key in [
        'first_name', 'last_name', 'email', 'phone_number', 
        'vin_number', 'license_plate', 'text_area'
    ]}
    # Add additional processing logic if needed

    # Return a confirmation response
    return jsonify({'message': 'Form submitted successfully', 'data': data})

# Run Server
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=(ENV == "development"))
