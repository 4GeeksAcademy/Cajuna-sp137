from pydantic import BaseModel, ConfigDict, Field


class CompanyCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, max_length=150)
    tax_id: str = Field(min_length=1, max_length=50)
    phone: str | None = Field(default=None, max_length=30)
    address: str | None = Field(default=None, max_length=150)
    city: str | None = Field(default=None, max_length=100)
    country: str = Field(min_length=1, max_length=100)
    admin_first_name: str = Field(min_length=1, max_length=100)
    admin_last_name: str = Field(min_length=1, max_length=100)
    admin_email: str = Field(min_length=1, max_length=255)
    admin_password: str = Field(min_length=1, max_length=255)


class CompanyPatchSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=150)
    tax_id: str | None = Field(default=None, min_length=1, max_length=50)
    phone: str | None = Field(default=None, max_length=30)
    address: str | None = Field(default=None, max_length=150)
    city: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, min_length=1, max_length=100)