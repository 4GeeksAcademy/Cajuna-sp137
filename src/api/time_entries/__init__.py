from flask import Blueprint
from flask_cors import CORS


time_entries_bp = Blueprint("time_entries", __name__)
CORS(time_entries_bp)

from . import routes

