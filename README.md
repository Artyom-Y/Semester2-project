# Semester 2 Project — Premium Pharmatics Dashboard

This prototype is a small Flask web app demonstrating a delivery/dashboard interface for a medical delivery company. It includes a simple login, a dashboard showing drivers and orders, and settings to configure a Google Maps API key.

## Prerequisites

- Python 3.10+ (project used Python 3.14 in development)
- Git (optional)

## Install

1. Create and activate a virtual environment:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1   # PowerShell
# or .venv\Scripts\activate for cmd
```

2. Install dependencies:

```powershell
pip install -r requirement.txt
```

3. The app will create a `.env` file automatically on first run. To use Google Maps features, add your key to `.env` as:

```
GOOGLE_MAPS_KEY=YOUR_KEY_HERE
```

You can also set the key from the app Settings page after starting the server.

## Run

Start the app locally:

```powershell
python app.py
```

Then open http://127.0.0.1:5000 in your browser.

## Default credentials

- Username: `root`
- Password: `1234`

## Project structure (important files)

- `app.py` — Flask application and routes
- `utils.py` — helper functions for DB access and .env handling
- `mock_data.py` — helpers to populate `database.sqlite` with test data
- `database.sqlite` — bundled sqlite database with example data
- `templates/` — Jinja2 HTML templates (login, dashboard, settings, navbar)
- `static/` — static assets (CSS and JS)
- `requirement.txt` — Python dependencies

## Notes

- The app uses a local SQLite database shipped as `database.sqlite`.
- For production use remove `app.secret_key` hardcoding and set proper configuration (secret, host, debug=False).

## Contributors

- Artem, Success, Yuchen

---