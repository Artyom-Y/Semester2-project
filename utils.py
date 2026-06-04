import sqlite3
import os
from dotenv import load_dotenv, find_dotenv, set_key

def login_check(username: str, password: str) -> bool:
    con = sqlite3.connect("database.sqlite")
    cur = con.cursor()
    cur.execute(f"SELECT * FROM users WHERE login = '{username}' and password = '{password}'")
    res = cur.fetchone()

    if res is None:
        return False
    return True


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