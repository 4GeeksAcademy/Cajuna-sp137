from flask import Blueprint
from flask_cors import CORS

employees_bp = Blueprint("employees", __name__)
CORS(employees_bp)

from . import routes
