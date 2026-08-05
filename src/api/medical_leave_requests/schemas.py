from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class MedicalLeaveRequestCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    employee_id: int
    start_date: date
    end_date: date
    document: str = Field(min_length=1, max_length=255)


class MedicalLeaveRequestPatchSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    employee_id: int | None = None
    start_date: date | None = None
    end_date: date | None = None
    document: str | None = Field(default=None, min_length=1, max_length=255)
    status: str | None = Field(default=None, min_length=1, max_length=50)
