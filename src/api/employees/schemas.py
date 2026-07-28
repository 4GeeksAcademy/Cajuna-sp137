from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EmployeeCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    first_name: str = Field(
        min_length=1,
        max_length=100,
    )
    last_name: str = Field(
        min_length=1,
        max_length=100,
    )
    email: EmailStr
    password: str
    phone: str | None = Field(
        default=None,
        max_length=30,
    )
    is_admin: bool = False


class EmployeePatchSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")
    first_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    last_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    email: EmailStr | None = None
    password: str | None = Field(
        default=None,
        max_length=255,
    )
    phone: str | None = Field(
        default=None,
        max_length=30,
    )
    is_admin: bool | None = None
    is_active: bool | None = None
