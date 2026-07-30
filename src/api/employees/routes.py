from http import HTTPStatus

from flask import jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from api.employees import employees_bp
from api.models import Employee, db

from .schemas import EmployeeCreateSchema, EmployeePatchSchema


@employees_bp.get("/employees")
def get_employees():
    company_id = request.args.get("company_id", type=int)
    query = select(Employee)
    if company_id:
        query = query.where(Employee.company_id == company_id)
    employees = db.session.scalars(query).all()
    return jsonify([employee.to_dict() for employee in employees]), HTTPStatus.OK


@employees_bp.get("/employees/<int:employee_id>")
def get_employee(employee_id: int):
    employee: Employee | None = db.session.get(Employee, employee_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), HTTPStatus.NOT_FOUND
    return jsonify(employee.to_dict()), HTTPStatus.OK


@employees_bp.delete("/employees/<int:employee_id>")
def delete_employee(employee_id: int):
    employee: Employee | None = db.session.get(Employee, employee_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted"}), HTTPStatus.OK


@employees_bp.post("/employees")
def create_employee():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {"error": "Request body must be a valid JSON object"}
        ), HTTPStatus.BAD_REQUEST

    try:
        employee_data = EmployeeCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    employee = Employee(
        company_id=employee_data.company_id,
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        email=employee_data.email,
        password=employee_data.password,
        phone=employee_data.phone,
    )

    db.session.add(employee)
    db.session.commit()

    return jsonify(
        {
            "message": "Employee created",
            "id": employee.id,
        }
    ), HTTPStatus.CREATED


@employees_bp.patch("/employees/<int:employee_id>")
def update_employee(employee_id: int):
    employee: Employee | None = db.session.get(Employee, employee_id)
    if employee is None:
        return jsonify({"error": "Employee not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = EmployeePatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(employee, field, value)

    db.session.commit()

    return jsonify(employee.to_dict()), HTTPStatus.OK
