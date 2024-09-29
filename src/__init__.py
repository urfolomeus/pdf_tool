from flask import Flask

from .pdf import pdf_blueprint


def create_app():
    app = Flask(__name__)

    app.register_blueprint(pdf_blueprint)

    return app
