from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class PermitRequestCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    employee_id: int
    start_date: date
    end_date: date
    reason: str = Field(min_length=1, max_length=500)


class PermitRequestPatchSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    employee_id: int | None = None
    start_date: date | None = None
    end_date: date | None = None
    reason: str | None = Field(default=None, min_length=1, max_length=500)
    status: str | None = Field(default=None, min_length=1, max_length=50)
