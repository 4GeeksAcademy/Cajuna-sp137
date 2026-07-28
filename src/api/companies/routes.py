# from http import HTTPStatus

# from flask import jsonify, request
# from pydantic import ValidationError
# from sqlalchemy import select

# from api.employees import employees_bp
# from api.models import Employee, db

# from .schemas import EmployeeCreateSchema, EmployeePatchSchema


from http import HTTPStatus

from flask import jsonify, request
from flask_cors import CORS
from pydantic import ValidationError
from sqlalchemy import select

from api.companies import companies_bp

from .schemas import CompanyCreateSchema, CompanyPatchSchema

CORS(companies_bp)
from api.models import Company, db


@companies_bp.get("/companies")
def get_companies():
    employees = db.session.scalars(select(Company)).all()
    return jsonify([employee.to_dict() for employee in employees]), HTTPStatus.OK


@companies_bp.get("/companies/<int:company_id>")
def get_employee(company_id: int):
    company: Company | None = db.session.get(Company, company_id)
    if not company:
        return jsonify({"error": "Company not found"}), HTTPStatus.NOT_FOUND
    return jsonify(company.to_dict()), HTTPStatus.OK


@companies_bp.delete("/companies/<int:company_id>")
def delete_company(company_id: int):
    company: Company | None = db.session.get(Company, company_id)
    if not company:
        return jsonify({"error": "Company not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(company)
    db.session.commit()
    return jsonify({"message": "Company deleted"}), HTTPStatus.OK


@companies_bp.post("/companies")
def create_company():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {"error": "Request body must be a valid JSON object"}
        ), HTTPStatus.BAD_REQUEST

    try:
        company_data = CompanyCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    company = Company(
        name=company_data.name,
        tax_id=company_data.tax_id,
        phone=company_data.phone,
        address=company_data.address,
        city=company_data.city,
        country=company_data.country,
    )

    db.session.add(company)
    db.session.commit()

    return jsonify(
        {
            "message": "Company created",
            "id": company.id,
        }
    ), HTTPStatus.CREATED


@companies_bp.patch("/companies/<int:company_id>")
def update_company(company_id: int):
    company: Company | None = db.session.get(Company, company_id)
    if company is None:
        return jsonify({"error": "Company not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = CompanyPatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(company, field, value)

    db.session.commit()

    return jsonify(company.to_dict()), HTTPStatus.OK
