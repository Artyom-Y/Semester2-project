# Semester 2 Project — MediRun Dashboard

This prototype is a Flask web app with a dashboard for a made up small last-mile medical delivery company. It includes a simple login, a dashboard showing drivers and orders (with google maps visualization), and settings to configure a Google Maps API key. The data is stored in an SQLite database

## Prerequisites

- Python 3.14.5
- pip added to PATH

## Install

1. Create and activate a virtual environment:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1   # for PowerShell
.venv\Scripts\activate # for CMD
```

2. Install dependencies:

```powershell
pip install -r requirement.txt
```

3. The app will create a `.env` file automatically on first run. To use Google Maps features, add your key to `.env` as:

```
GOOGLE_MAPS_KEY='YOUR_KEY_HERE'
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

- `app.py` - Flask application and routes
- `utils.py` - helper functions for DB access and .env handling
- `mock_data.py` - helpers to populate `database.sqlite` with test data
- `database.sqlite` - sqlite database with example data
- `templates/` - HTML
- `static/` - CSS and JS
- `requirement.txt` - Python dependencies
- `database.sqlite` - local SQLite database