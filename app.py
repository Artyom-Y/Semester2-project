from flask import Flask, render_template, session, redirect, url_for, request
from utils import login_check

app = Flask(__name__)
app.secret_key = "semester project"

# remove on production
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.jinja_env.auto_reload = True

@app.route("/", methods=["GET", "POST"])
def login():
    login_error = ""

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user_exists = login_check(username, password)
        if user_exists:
            session["user"] = username
        else:
            login_error = "User not found."

    if "user" not in session:
        return render_template("login.html", login_error = login_error)
    else:
        return redirect(url_for("dashboard"))


@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)
