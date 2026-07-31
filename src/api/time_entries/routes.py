
from datetime import UTC, datetime
from http import HTTPStatus

from flask import jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from api.models import TimeEntry, db
from api.time_entries import time_entries_bp

from .schemas import TimeEntryCreateSchema, TimeEntryPatchSchema


@time_entries_bp.get("/time_entries")
def get_time_entries():
    employee_id = request.args.get("employee_id", type=int)
    query = select(TimeEntry)
    if employee_id:
        query = query.where(TimeEntry.employee_id == employee_id)
    entries = db.session.scalars(query).all()
    return jsonify([entry.to_dict() for entry in entries]), HTTPStatus.OK


@time_entries_bp.get("/time_entries/<int:time_entry_id>")
def get_time_entry(time_entry_id: int):
    entry: TimeEntry | None = db.session.get(TimeEntry, time_entry_id)
    if not entry:
        return jsonify({"error": "Time entry not found"}), HTTPStatus.NOT_FOUND
    return jsonify(entry.to_dict()), HTTPStatus.OK


@time_entries_bp.delete("/time_entries/<int:time_entry_id>")
def delete_time_entry(time_entry_id: int):
    entry: TimeEntry | None = db.session.get(TimeEntry, time_entry_id)
    if not entry:
        return jsonify({"error": "Time entry not found"}), HTTPStatus.NOT_FOUND
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Time entry deleted"}), HTTPStatus.OK


@time_entries_bp.post("/time_entries")
def create_time_entry():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a valid JSON object"}), HTTPStatus.BAD_REQUEST
    try:
        entry_data = TimeEntryCreateSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    entry = TimeEntry(
        employee_id=entry_data.employee_id,
        check_in=entry_data.check_in or datetime.now(UTC)
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify(entry.to_dict()), HTTPStatus.CREATED


@time_entries_bp.post("/time_entries/<int:time_entry_id>/check-out")
def check_out_time_entry(time_entry_id: int):
    entry: TimeEntry | None = db.session.get(TimeEntry, time_entry_id)
    if not entry:
        return jsonify({"error": "Time entry not found"}), HTTPStatus.NOT_FOUND
    if entry.check_out is not None:
        return jsonify(
            {"error": "Time entry already checked out"}
        ), HTTPStatus.CONFLICT

    entry.check_out = datetime.now(UTC)
    db.session.commit()

    return jsonify(entry.to_dict()), HTTPStatus.OK


@time_entries_bp.patch("/time_entries/<int:time_entry_id>")
def update_time_entry(time_entry_id: int):
    entry: TimeEntry | None = db.session.get(TimeEntry, time_entry_id)
    if entry is None:
        return jsonify({"error": "Time entry not found"}), HTTPStatus.NOT_FOUND
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        schema = TimeEntryPatchSchema.model_validate(data)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), HTTPStatus.UNPROCESSABLE_ENTITY

    updates = schema.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(entry, field, value)

    db.session.commit()

    return jsonify(entry.to_dict()), HTTPStatus.OK
