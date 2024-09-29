from operator import itemgetter

from flask import jsonify, render_template, request, send_from_directory

from . import pdf_blueprint


@pdf_blueprint.route("/")
def index():
    return render_template("index.html")


@pdf_blueprint.route("/pdf/<filename>")
def serve_pdf(filename):
    return send_from_directory("pdf/files/", filename)


@pdf_blueprint.route("/pdf/selection", methods=["POST"])
def process_selection():
    data = request.json
    id, x, y, width, height = itemgetter("id", "x", "y", "width", "height")(data)

    print(f"ID: {id}, X: {x}, Y: {y}, Width: {width}, Height: {height}")

    # hardwiring for now
    value = "255"

    return jsonify({"result": {"id": id, "value": value}})
