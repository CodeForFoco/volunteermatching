from flask import render_template, request
from volunteercore.errors import bp
from volunteercore import db
from volunteercore.api.errors import error_response as api_error_response


@bp.app_errorhandler(404)
def not_found_error(error):
    print(error)
    return api_error_response(404)


@bp.app_errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return api_error_response(500)
