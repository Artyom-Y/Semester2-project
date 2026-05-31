from flask import Flask, render_template, session, redirect, url_for

app = Flask(__name__)

# remove on production
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.jinja_env.auto_reload = True

@app.route("/")
def login():
    if not session["user"]:
        return render_template("login.html")
    else:
        redirect(url_for("dashboard.html"))

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

if __name__ == '__main__':
    app.run(debug=True)
