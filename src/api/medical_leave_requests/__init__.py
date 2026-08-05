from flask import Blueprint
from flask_cors import CORS

medical_leave_requests_bp = Blueprint("medical_leave_requests", __name__)
CORS(medical_leave_requests_bp)

from . import routes
