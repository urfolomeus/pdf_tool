from flask import render_template, send_from_directory

from . import pdf_blueprint


@pdf_blueprint.route("/")
def index():
    return render_template("index.html")


@pdf_blueprint.route("/pdf/<filename>")
def serve_pdf(filename):
    return send_from_directory("pdf/files/", filename)
