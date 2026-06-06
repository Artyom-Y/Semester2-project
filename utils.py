import sqlite3
import os
from dotenv import load_dotenv, find_dotenv, set_key

def login_check(username: str, password: str) -> bool:
    con = sqlite3.connect("database.sqlite")
    cur = con.cursor()
    cur.execute("SELECT * FROM users WHERE login = ? and password = ?", (username, password))
    res = cur.fetchone()

    return res is not None

# .env file
def create_env_if_not_exists():
    if not os.path.exists(".env"):
        with open(".env", "w") as file:
            file.write("GOOGLE_MAPS_KEY=''")

def get_google_key() -> str | None:
    load_dotenv(".env")
    return os.getenv("GOOGLE_MAPS_KEY")

def set_google_key(value: str):
    path = find_dotenv()
    load_dotenv()
    set_key(path, "GOOGLE_MAPS_KEY", value)

# dashboard data
def get_table(name):
    con = sqlite3.connect("database.sqlite")
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute(f"SELECT * FROM {name.strip()}")
    return [dict(row) for row in cur.fetchall()]

def get_orders():
    """Returns orders as a list of dictionaries."""
    con = sqlite3.connect("database.sqlite")
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM orders INNER JOIN customers USING(cust_id)")
    orders = [dict(row) for row in cur.fetchall()]
    return orders