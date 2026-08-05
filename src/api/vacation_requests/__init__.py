from flask import Blueprint
from flask_cors import CORS

vacation_requests_bp = Blueprint("vacation_requests", __name__)
CORS(vacation_requests_bp)

from . import routes
