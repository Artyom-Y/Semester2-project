from flask import Flask, render_template, session, redirect, url_for, request
from utils import login_check, create_env_if_not_exists, get_google_key, set_google_key, get_table, get_orders
from mock_data import random_customers, random_orders

app = Flask(__name__)
app.secret_key = "semester project"

@app.route("/", methods=["GET", "POST"])
def login():
    create_env_if_not_exists()
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
    return render_template("dashboard.html", drivers=get_table("drivers"), facilities=get_table("facilities"), orders=get_orders(), google_maps_key=get_google_key())

settings_messages = {"rand_ord": "Randomized orders successfully", "rand_cust_ord": "Randomized orders and customers successfully"}

@app.route("/settings", methods=["GET", "POST"])
def settings(settings_status=""):
    google_maps_key = get_google_key()
    settings_status = request.args.get("settings_status")
    if settings_status in settings_messages.keys():
        display_message = settings_messages[settings_status]
    else:
        display_message = ""

    if request.method == "POST":
        new_key = request.form["google_maps_key"]
        try:
            set_google_key(new_key)
            google_maps_key = new_key
        except:
            settings_status = "Couldn't update the key"

    return render_template("settings.html", display_message=display_message, google_maps_key=google_maps_key)

@app.route("/randomize")
def randomize():
    randomize_type = request.args["type"]
    if randomize_type == "orders":
        random_orders()
        return redirect(url_for("settings", settings_status="rand_ord"))
    
    if randomize_type == "customers_orders":
        customer_count = int(request.args["customer_count"])
        random_customers(customer_count)
        random_orders()
        return redirect(url_for("settings", settings_status="rand_cust_ord"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run()