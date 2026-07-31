from datetime import UTC, datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Company(db.Model):
    __tablename__: str = "company"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    tax_id: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    employees: Mapped[list["Employee"]] = relationship(
        back_populates="company")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tax_id": self.tax_id,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "created_at": self.created_at.isoformat(),
        }


class Employee(db.Model):
    __tablename__: str = "employee"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    company_id: Mapped[int] = mapped_column(
        ForeignKey("company.id"),
        nullable=False,
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    company: Mapped["Company"] = relationship(back_populates="employees")
    time_entries: Mapped[list["TimeEntry"]] = relationship(
        back_populates="employee"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "company_id": self.company_id,
            "company_name": self.company.name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class Material(db.Model):
    __tablename__: str = "material"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    company_id: Mapped[int] = mapped_column(
        ForeignKey("company.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    minimum_stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "company_id": self.company_id,
            "name": self.name,
            "quantity": self.quantity,
            "unit": self.unit,
            "minimum_stock": self.minimum_stock,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class MaterialRequest(db.Model):
    __tablename__: str = "material_request"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employee.id"),
        nullable=False,
    )

    company_id: Mapped[int] = mapped_column(
        ForeignKey("company.id"),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="pendiente",
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    employee: Mapped["Employee"] = relationship()
    items: Mapped[list["MaterialRequestItem"]] = relationship(
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "employee_name": f"{self.employee.first_name} {self.employee.last_name}",
            "company_id": self.company_id,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class MaterialRequestItem(db.Model):
    __tablename__: str = "material_request_item"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    request_id: Mapped[int] = mapped_column(
        ForeignKey("material_request.id"),
        nullable=False,
    )

    material_id: Mapped[int] = mapped_column(
        ForeignKey("material.id"),
        nullable=False,
    )

    quantity_requested: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    material: Mapped["Material"] = relationship()

    def to_dict(self):
        return {
            "id": self.id,
            "request_id": self.request_id,
            "material_id": self.material_id,
            "material_name": self.material.name,
            "quantity_requested": self.quantity_requested,
        }


class TimeEntry(db.Model):
    __tablename__: str = "time_entry"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employee.id"),
        nullable=False,
    )

    check_in: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    check_out: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    employee: Mapped["Employee"] = relationship(back_populates="time_entries")

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "employee_name": f"{self.employee.first_name} {self.employee.last_name}",
            "check_in": self.check_in.isoformat(),
            "check_out": self.check_out.isoformat() if self.check_out else None,
        }
