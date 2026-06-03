import sqlite3

def login_check(username, password):
    con = sqlite3.connect("database.sqlite")
    cur = con.cursor()
    cur.execute(f"SELECT * FROM users WHERE login = '{username}' and password = '{password}'")
    res = cur.fetchone()

    if res is None:
        return False
    return True