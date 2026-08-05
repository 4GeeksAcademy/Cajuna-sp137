# AGENTS.md

4Geeks React + Flask boilerplate customized into a construction-materials management app (companies, employees, materials, material requests, time entries). Backend is the Flask API; frontend is a Vite React SPA it also serves in production.

## Commands

Backend (Python, Pipenv — source of truth is `Pipfile`, **not** the stale `requirements.txt`):
- Run API: `pipenv run start` (Flask on port **3001**)
- Migrations after model changes: `pipenv run migrate` then `pipenv run upgrade`; undo with `pipenv run downgrade`
- Seed full demo data (3 companies / 27 employees / 27 materials / 15 requests): `pipenv run flask insert-test-data` — there is no `insert-test-data` entry in Pipfile scripts; use `pipenv run flask ...`

Frontend (npm):
- Dev server: `npm run start` (or `npm run dev`) — Vite on port **3000**
- Build (required for anything production serves): `npm run build` → `dist/`
- Lint: `npm run lint` (ESLint, `--max-warnings 0`; errors on `react/prop-types` missing, missing semicolons; `no-unused-vars` is off, `comma-dangle` never)

There is no test suite, no CI, no pre-commit. Verify backend work by running it and hitting endpoints (dev root `/` prints the sitemap).

## Setup / env gotchas

- Copy `.env.example` → `.env`. `main.jsx` renders a setup screen instead of the app if `VITE_BACKEND_URL` is missing/empty, so always set it (e.g. `http://localhost:3001`).
- Frontend calls the API through `import.meta.env.VITE_BACKEND_URL` in plain `fetch` (no axios). Vite env vars must be prefixed `VITE_`.
- `app.py` rewrites `postgres://` → `postgresql://` in `DATABASE_URL`. With no `DATABASE_URL` it falls back to SQLite at `/tmp/test.db`.

## Backend structure

- `src/api/models.py`: all SQLAlchemy models using SQLAlchemy 2.0 style (`Mapped`/`mapped_column`). Serialization uses **`to_dict()`**, not `serialize()`. New models are picked up automatically by Flask-Admin.
- `src/api/<domain>/` (companies, employees, materials, material_requests, time_entries) contains three files, keep this pattern:
  - `__init__.py` — defines the Blueprint + `CORS()`; imported routes at the bottom
  - `routes.py` — CRUD: `GET` list (with optional `?company_id=` filter), `GET`/`PATCH`/`DELETE` by id, `POST` create
  - `schemas.py` — Pydantic v2, `ConfigDict(extra="forbid")`, separate `XCreateSchema` and `XPatchSchema`
- Register any new blueprint in `src/app.py` with `url_prefix="/api"`.
- Domain logic lives in `routes.py` (no service layer). Error responses are `{"error": ...}` or `{"errors": [...]}` from pydantic; use `HTTPStatus` constants.
- CLI seed/utility commands are registered in `src/api/commands.py` (`setup_commands`).
- URL naming is inconsistent — `time_entries` uses underscores, the rest use kebab-case (`material-requests`). Match the existing resource.

## Frontend structure

- Routes in `src/front/routes.jsx` (react-router-dom v6 `createBrowserRouter`), nested under `Layout`; every resource has list/new/detail/edit/delete pages.
- Global state via `useGlobalReducer` + `src/front/store.js`; `store.selectedCompany` (set by `CompanySelector`) filters most lists via `?company_id=`.
- Bootstrap 5.3 comes from CDN in `index.html`; `src/front/index.css` is empty — don't add CSS dependencies via npm without checking first.
- UI text is mixed Spanish/English (buttons "Ver"/"Editar"/"Eliminar"). Material request statuses are Spanish lowercase strings: `pendiente`, `aprobado`, `rechazado` (default `pendiente`).

## Deploy

- Render: `render_build.sh` runs `npm install && npm run build && pipenv install && pipenv run upgrade`; `render.yaml` pins `PYTHON_VERSION=3.10.6` (Pipfile wants 3.13 — dev and prod Python differ).
- Flask serves the built `dist/` in production, so rebuild the frontend before expecting changes in a deployed/preview environment.

## Git

- Default branch is `develop` (also `main`); work is committed there with mixed English/Spanish messages matching recent history.
