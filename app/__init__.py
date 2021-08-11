import loggerconfig

log = loggerconfig.getLogger(__name__)

log.info("Starting application...")

import os
from flask import Flask
import config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager

log.debug("Initializing DB.")
# db = SQLAlchemy()

def create_app():
    log.debug("Initializing Flask.")
    app = Flask(__name__)
    log.debug("Configurating Flask.")
    app.config.from_object(config.FlaskConfig)
    log.debug("Initializing CSRFProtection.")
    csrf = CSRFProtect(app)
    return app

app = create_app()

from app import routes

log.info("Application started.")