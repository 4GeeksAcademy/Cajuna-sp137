from flask import Blueprint
from flask_cors import CORS

material_requests_bp = Blueprint("material_requests", __name__)
CORS(material_requests_bp)

from . import routes
