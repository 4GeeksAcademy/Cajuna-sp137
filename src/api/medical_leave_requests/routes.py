from http import HTTPStatus

from flask import jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from api.medical_leave_requests import medical_leave_requests_bp
from api.models import Employee, MedicalLeaveRequest, db

from .schemas import (
    MedicalLeaveRequestCreateSchema,
    MedicalLeaveRequestPatchSchema,
)


@medical_leave_requests_bp.get("/medical-leave-requests")
def get_medical_leave_requests():
    employee_id = request.args.get("employee_id", type=int)
    company_id = request.args.get("company_id", type=int)
    query = select(MedicalLeaveRequest)
    if company_id:
        query = query.join(Employee).where(Employee.company_id == company_id)
    if employee_id:
        query = query.where(MedicalLeaveRequest.employee_id == employee_id)
    requests = db.session.scalars(query).all()
    return jsonify([req.to_dict() for req in requests]), HTTPStatus.OK


@medical_leave_requests_bp.get("/medical-leave-requests/<int:request_id>")
def get_medical_leave_request(request_id: int):
    req: MedicalLeaveRequest | None = db.session.get(MedicalLeaveRequest, request_id)
    if not req:
        return jsonify({"error": "Medical leave request not found"}), HTTPStatus.NOT_FOUND
    return jsonify(req.to_dict()), HTTPStatus.OK


@medical_leave_requests_bp.delete("/medical-leave-requests/<int:request_id>")
def delete_medical_leave_request(request_id: int):
    req: MedicalLeaveRequest | None = db.session.get(MedicalLeaveRequest, request_id)
    if not req:
        return jsonify({"error": "Medical leave request not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Medical leave request deleted"}), HTTPStatus.OK


@medical_leave_requests_bp.post("/medical-leave-requests")
def create_medical_leave_request():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {"error": "Request body must be a valid JSON object"}
        ), HTTPStatus.BAD_REQUEST

    try:
        request_data = MedicalLeaveRequestCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    req = MedicalLeaveRequest(
        employee_id=request_data.employee_id,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
        document=request_data.document,
    )

    db.session.add(req)
    db.session.commit()

    return jsonify(req.to_dict()), HTTPStatus.CREATED


@medical_leave_requests_bp.patch("/medical-leave-requests/<int:request_id>")
def update_medical_leave_request(request_id: int):
    req: MedicalLeaveRequest | None = db.session.get(MedicalLeaveRequest, request_id)
    if req is None:
        return jsonify({"error": "Medical leave request not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = MedicalLeaveRequestPatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(req, field, value)

    db.session.commit()

    return jsonify(req.to_dict()), HTTPStatus.OK
