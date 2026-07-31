from pydantic import BaseModel, ConfigDict, Field


class MaterialRequestItemSchema(BaseModel):
    material_id: int
    quantity_requested: int = Field(ge=1)


class MaterialRequestCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    employee_id: int
    company_id: int
    notes: str | None = Field(default=None, max_length=500)
    items: list[MaterialRequestItemSchema] = Field(min_length=1)


class MaterialRequestPatchSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: str | None = Field(default=None, min_length=1, max_length=50)
    notes: str | None = Field(default=None, max_length=500)
