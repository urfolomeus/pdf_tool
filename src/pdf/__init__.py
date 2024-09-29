from flask import Blueprint

pdf_blueprint = Blueprint("pdf", __name__, template_folder="templates")

from . import routes  # noqa: E402, F401
