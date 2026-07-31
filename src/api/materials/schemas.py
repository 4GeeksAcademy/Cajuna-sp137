from pydantic import BaseModel, ConfigDict, Field


class MaterialCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    company_id: int
    name: str = Field(min_length=1, max_length=200)
    quantity: int = Field(default=0, ge=0)
    unit: str = Field(min_length=1, max_length=50)
    minimum_stock: int = Field(default=0, ge=0)


class MaterialPatchSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str | None = Field(default=None, min_length=1, max_length=200)
    quantity: int | None = Field(default=None, ge=0)
    unit: str | None = Field(default=None, min_length=1, max_length=50)
    minimum_stock: int | None = Field(default=None, ge=0)
