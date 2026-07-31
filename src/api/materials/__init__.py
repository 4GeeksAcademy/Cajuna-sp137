from flask import Blueprint
from flask_cors import CORS

materials_bp = Blueprint("materials", __name__)
CORS(materials_bp)

from . import routes
