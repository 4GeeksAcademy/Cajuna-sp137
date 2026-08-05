from http import HTTPStatus

from flask import jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from api.models import Employee, PermitRequest, db
from api.permit_requests import permit_requests_bp

from .schemas import (
    PermitRequestCreateSchema,
    PermitRequestPatchSchema,
)


@permit_requests_bp.get("/permit-requests")
def get_permit_requests():
    employee_id = request.args.get("employee_id", type=int)
    company_id = request.args.get("company_id", type=int)
    query = select(PermitRequest)
    if company_id:
        query = query.join(Employee).where(Employee.company_id == company_id)
    if employee_id:
        query = query.where(PermitRequest.employee_id == employee_id)
    requests = db.session.scalars(query).all()
    return jsonify([req.to_dict() for req in requests]), HTTPStatus.OK


@permit_requests_bp.get("/permit-requests/<int:request_id>")
def get_permit_request(request_id: int):
    req: PermitRequest | None = db.session.get(PermitRequest, request_id)
    if not req:
        return jsonify({"error": "Permit request not found"}), HTTPStatus.NOT_FOUND
    return jsonify(req.to_dict()), HTTPStatus.OK


@permit_requests_bp.delete("/permit-requests/<int:request_id>")
def delete_permit_request(request_id: int):
    req: PermitRequest | None = db.session.get(PermitRequest, request_id)
    if not req:
        return jsonify({"error": "Permit request not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Permit request deleted"}), HTTPStatus.OK


@permit_requests_bp.post("/permit-requests")
def create_permit_request():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {"error": "Request body must be a valid JSON object"}
        ), HTTPStatus.BAD_REQUEST

    try:
        request_data = PermitRequestCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    req = PermitRequest(
        employee_id=request_data.employee_id,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
        reason=request_data.reason,
    )

    db.session.add(req)
    db.session.commit()

    return jsonify(req.to_dict()), HTTPStatus.CREATED


@permit_requests_bp.patch("/permit-requests/<int:request_id>")
def update_permit_request(request_id: int):
    req: PermitRequest | None = db.session.get(PermitRequest, request_id)
    if req is None:
        return jsonify({"error": "Permit request not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = PermitRequestPatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(req, field, value)

    db.session.commit()

    return jsonify(req.to_dict()), HTTPStatus.OK
