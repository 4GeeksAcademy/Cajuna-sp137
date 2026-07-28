from flask import Blueprint
from flask_cors import CORS

companies_bp = Blueprint("companies", __name__)
CORS(companies_bp)

from . import routes
