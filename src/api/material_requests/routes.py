from http import HTTPStatus

from flask import jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from api.material_requests import material_requests_bp
from api.models import MaterialRequest, MaterialRequestItem, db

from .schemas import (
    MaterialRequestCreateSchema,
    MaterialRequestPatchSchema,
)


@material_requests_bp.get("/material-requests")
def get_material_requests():
    company_id = request.args.get("company_id", type=int)
    query = select(MaterialRequest)
    if company_id:
        query = query.where(MaterialRequest.company_id == company_id)
    requests = db.session.scalars(query).all()
    result = []
    for req in requests:
        data = req.to_dict()
        data["items"] = [item.to_dict() for item in req.items]
        result.append(data)
    return jsonify(result), HTTPStatus.OK


@material_requests_bp.get("/material-requests/<int:request_id>")
def get_material_request(request_id: int):
    req: MaterialRequest | None = db.session.get(MaterialRequest, request_id)
    if not req:
        return jsonify({"error": "Material request not found"}), HTTPStatus.NOT_FOUND
    data = req.to_dict()
    data["items"] = [item.to_dict() for item in req.items]
    return jsonify(data), HTTPStatus.OK


@material_requests_bp.post("/material-requests")
def create_material_request():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {"error": "Request body must be a valid JSON object"}
        ), HTTPStatus.BAD_REQUEST

    try:
        request_data = MaterialRequestCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    req = MaterialRequest(
        employee_id=request_data.employee_id,
        company_id=request_data.company_id,
        notes=request_data.notes,
    )
    db.session.add(req)
    db.session.flush()

    for item_data in request_data.items:
        item = MaterialRequestItem(
            request_id=req.id,
            material_id=item_data.material_id,
            quantity_requested=item_data.quantity_requested,
        )
        db.session.add(item)

    db.session.commit()

    data = req.to_dict()
    data["items"] = [item.to_dict() for item in req.items]
    return jsonify(data), HTTPStatus.CREATED


@material_requests_bp.patch("/material-requests/<int:request_id>")
def update_material_request(request_id: int):
    req: MaterialRequest | None = db.session.get(MaterialRequest, request_id)
    if req is None:
        return jsonify({"error": "Material request not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = MaterialRequestPatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(req, field, value)

    db.session.commit()

    data = req.to_dict()
    data["items"] = [item.to_dict() for item in req.items]
    return jsonify(data), HTTPStatus.OK


@material_requests_bp.delete("/material-requests/<int:request_id>")
def delete_material_request(request_id: int):
    req: MaterialRequest | None = db.session.get(MaterialRequest, request_id)
    if not req:
        return jsonify({"error": "Material request not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Material request deleted"}), HTTPStatus.OK
