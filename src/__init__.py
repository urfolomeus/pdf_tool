from flask import Flask

from .pdf import pdf_blueprint
from .pdf.utils.strategies import easyocr_reader


def create_app():
    app = Flask(__name__)

    app.config["OCR_READER"] = easyocr_reader.EasyOCRReader()

    app.register_blueprint(pdf_blueprint)

    return app
