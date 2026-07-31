from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TimeEntryCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    employee_id: int
    check_in: datetime | None = None


class TimeEntryPatchSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    check_out: datetime | None = None
