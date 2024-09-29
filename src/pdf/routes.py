from operator import itemgetter

from flask import jsonify, render_template, request, send_from_directory

from . import pdf_blueprint
from .utils.pdf_processor import crop, crop_to_text


@pdf_blueprint.route("/")
def index():
    return render_template("index.html")


@pdf_blueprint.route("/pdf/<filename>")
def serve_pdf(filename):
    return send_from_directory("pdf/files/", filename)


@pdf_blueprint.route("/pdf/selection", methods=["POST"])
def process_selection():
    data = request.json
    id, x, y, width, height, canvas_width, canvas_height = itemgetter(
        "id", "x", "y", "width", "height", "canvasWidth", "canvasHeight"
    )(data)

    print(f"ID: {id}, X: {x}, Y: {y}, Width: {width}, Height: {height}")

    # Crop the image
    try:
        crop_path = crop(x, y, width, height, canvas_width, canvas_height)
        value = crop_to_text(crop_path)
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        return jsonify({"error": f"Error processing PDF: {str(e)}"}), 400

    return jsonify({"result": {"id": id, "value": value}})
