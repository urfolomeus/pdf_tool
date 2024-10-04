import os

from flask import Flask

from .pdf import pdf_blueprint
from .pdf.utils.strategies import easyocr_reader, paddle


def create_app():
    app = Flask(__name__)

    extractor = os.getenv("EXTRACTOR")
    print(f"Text extractor: {extractor}")

    match extractor:
        case "easyocr":
            app.config["OCR_READER"] = easyocr_reader.EasyOCRReader()
        case "paddle":
            app.config["OCR_READER"] = paddle.PaddleOCRReader()
        case _:
            raise ValueError(f"Invalid extractor: {extractor}")

    app.register_blueprint(pdf_blueprint)

    return app
