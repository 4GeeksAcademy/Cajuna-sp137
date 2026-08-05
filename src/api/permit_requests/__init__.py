from flask import Blueprint
from flask_cors import CORS

permit_requests_bp = Blueprint("permit_requests", __name__)
CORS(permit_requests_bp)

from . import routes
