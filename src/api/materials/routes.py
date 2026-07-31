from http import HTTPStatus

from flask import jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from api.materials import materials_bp
from api.models import Material, db

from .schemas import MaterialCreateSchema, MaterialPatchSchema


@materials_bp.get("/materials")
def get_materials():
    company_id = request.args.get("company_id", type=int)
    query = select(Material)
    if company_id:
        query = query.where(Material.company_id == company_id)
    materials = db.session.scalars(query).all()
    return jsonify([material.to_dict() for material in materials]), HTTPStatus.OK


@materials_bp.get("/materials/<int:material_id>")
def get_material(material_id: int):
    material: Material | None = db.session.get(Material, material_id)
    if not material:
        return jsonify({"error": "Material not found"}), HTTPStatus.NOT_FOUND
    return jsonify(material.to_dict()), HTTPStatus.OK


@materials_bp.delete("/materials/<int:material_id>")
def delete_material(material_id: int):
    material: Material | None = db.session.get(Material, material_id)
    if not material:
        return jsonify({"error": "Material not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(material)
    db.session.commit()
    return jsonify({"message": "Material deleted"}), HTTPStatus.OK


@materials_bp.post("/materials")
def create_material():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {"error": "Request body must be a valid JSON object"}
        ), HTTPStatus.BAD_REQUEST

    try:
        material_data = MaterialCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    material = Material(
        company_id=material_data.company_id,
        name=material_data.name,
        quantity=material_data.quantity,
        unit=material_data.unit,
        minimum_stock=material_data.minimum_stock,
    )

    db.session.add(material)
    db.session.commit()

    return jsonify(
        {
            "message": "Material created",
            "id": material.id,
        }
    ), HTTPStatus.CREATED


@materials_bp.patch("/materials/<int:material_id>")
def update_material(material_id: int):
    material: Material | None = db.session.get(Material, material_id)
    if material is None:
        return jsonify({"error": "Material not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = MaterialPatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(material, field, value)

    db.session.commit()

    return jsonify(material.to_dict()), HTTPStatus.OK
