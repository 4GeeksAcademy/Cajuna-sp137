from http import HTTPStatus

from flask import jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from api.models import Employee, VacationRequest, db
from api.vacation_requests import vacation_requests_bp

from .schemas import (
    VacationRequestCreateSchema,
    VacationRequestPatchSchema,
)


@vacation_requests_bp.get("/vacation-requests")
def get_vacation_requests():
    employee_id = request.args.get("employee_id", type=int)
    company_id = request.args.get("company_id", type=int)
    query = select(VacationRequest)
    if company_id:
        query = query.join(Employee).where(Employee.company_id == company_id)
    if employee_id:
        query = query.where(VacationRequest.employee_id == employee_id)
    requests = db.session.scalars(query).all()
    return jsonify([req.to_dict() for req in requests]), HTTPStatus.OK


@vacation_requests_bp.get("/vacation-requests/<int:request_id>")
def get_vacation_request(request_id: int):
    req: VacationRequest | None = db.session.get(VacationRequest, request_id)
    if not req:
        return jsonify({"error": "Vacation request not found"}), HTTPStatus.NOT_FOUND
    return jsonify(req.to_dict()), HTTPStatus.OK


@vacation_requests_bp.delete("/vacation-requests/<int:request_id>")
def delete_vacation_request(request_id: int):
    req: VacationRequest | None = db.session.get(VacationRequest, request_id)
    if not req:
        return jsonify({"error": "Vacation request not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Vacation request deleted"}), HTTPStatus.OK


@vacation_requests_bp.post("/vacation-requests")
def create_vacation_request():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {"error": "Request body must be a valid JSON object"}
        ), HTTPStatus.BAD_REQUEST

    try:
        request_data = VacationRequestCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    req = VacationRequest(
        employee_id=request_data.employee_id,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
    )

    db.session.add(req)
    db.session.commit()

    return jsonify(req.to_dict()), HTTPStatus.CREATED


@vacation_requests_bp.patch("/vacation-requests/<int:request_id>")
def update_vacation_request(request_id: int):
    req: VacationRequest | None = db.session.get(VacationRequest, request_id)
    if req is None:
        return jsonify({"error": "Vacation request not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = VacationRequestPatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(req, field, value)

    db.session.commit()

    return jsonify(req.to_dict()), HTTPStatus.OK
