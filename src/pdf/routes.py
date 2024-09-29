from flask import render_template

from . import pdf_blueprint


@pdf_blueprint.route("/")
def index():
    return render_template("index.html")
