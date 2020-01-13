import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from config import Config
import flask_whooshalchemyplus

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = 'api.login'
template_folder = os.path.join('../client/build/')

def create_app(config_class=Config):
    app = Flask(__name__)
    app.static_folder = os.path.join(template_folder, 'static/')
    app.template_folder = template_folder
    app.config.from_object(config_class)
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    flask_whooshalchemyplus.init_app(app)

    # Register blueprints
    from volunteercore.auth import bp as auth_bp
    app.register_blueprint(auth_bp)
    from volunteercore.volops import bp as volops_bp
    app.register_blueprint(volops_bp)
    from volunteercore.api import bp as api_bp
    app.register_blueprint(api_bp)
    from volunteercore.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    # Send all other requests to react
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path):
        return render_template('index.html')

    return app
