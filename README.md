# Sticky Dates Tools

A "Tools" section for theculinarygroup.com.au — free calculators and planners for
hospitality kitchens, gated behind a simple email/password login.

- **Backend** — Django + DRF + SimpleJWT, layered as views → handlers → services,
  with serializers for data transfer. SQLite for dev.
- **Frontend** — Vite + React + TypeScript, Ant Design + Tailwind CSS,
  react-query for data fetching, styled to match the Culinary Group site
  (cream `#F2EDE6`, ink `#1E1C1D`, maroon `#531c1c`, Jost typeface).

## Run the backend (port 8000)

```bash
cd backend
python3 -m venv .venv            # first time only
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_tools
.venv/bin/python manage.py runserver
```

## Run the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

## API

| Method | Path                  | Auth | Description                          |
| ------ | --------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/register/` | –    | Create account, returns user + JWTs  |
| POST   | `/api/auth/login/`    | –    | Login, returns user + JWTs           |
| POST   | `/api/auth/refresh/`  | –    | Refresh an access token              |
| GET    | `/api/auth/me/`       | JWT  | Current user                         |
| GET    | `/api/tools/`         | –    | Tools catalogue (public)             |
| GET    | `/api/tools/<slug>/`  | JWT  | Tool detail (members only)           |

## Tools

19 tools built from the original spreadsheets in `tools/`, grouped by category
(all require a free account; every tool supports saved entries):

- **Costing** — Recipe Cost Sheet, Food Cost Calculator, Food Cost,
  Food Cost %, Selling Price, Dish Profit, Cost of Preparation
- **Yield & Waste** — Yield %, Waste %, Cooking Loss %, Yield Test Sheet,
  Purchase Weight, Price per Kg, Wastage Chart
- **Spend & Period** — Food Cost for a Period, Weekly Spend, Sales vs Purchases
- **Menu & Profit / Kitchen Ops** — Menu Analysis, Recipe Scaler

Simple calculators are config-driven via
`frontend/src/tools/simpleTools.ts` + the generic `CalculatorTool` component;
table tools live in `frontend/src/pages/tools/`. Routing is by slug through
`frontend/src/tools/registry.tsx`. Manage the catalogue via Django admin or
`tools/management/commands/seed_tools.py` (`manage.py seed_tools` prunes
removed slugs).
