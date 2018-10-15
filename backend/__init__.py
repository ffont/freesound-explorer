import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from flask import Flask, g
import flask_login as login
from .settings import APPLICATION_ROOT, DOWNLOAD_FOLDER_PATH

sys.path.append('../..')

from social.apps.flask_app.routes import social_auth
from social.apps.flask_app.template_filters import backends
from social.apps.flask_app.default.models import init_social


# App
# We change the default static url path to '' so that 'static' route defined
# in routes/main.py takes precedene.
app = Flask(__name__, static_url_path='')
app.config.from_object('backend.settings')

if APPLICATION_ROOT:
    from werkzeug.serving import run_simple
    from werkzeug.wsgi import DispatcherMiddleware
    app.wsgi_app = DispatcherMiddleware(Flask('dummy_app'), {APPLICATION_ROOT: app.wsgi_app})


# Templates
# We modify the template loader to also look in the repository root folder.
# This is where index.html stays. Having index.html in the root allows us to
# statically host freesound-explorer (only enabling end user registration
# when the Flask backend in running).
import jinja2
import os
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__),".."))
my_loader = jinja2.ChoiceLoader([
    app.jinja_loader,
    jinja2.FileSystemLoader(root_dir),
])
app.jinja_loader = my_loader

# cleanup download path at startup from
# https://stackoverflow.com/questions/185936/how-to-delete-the-contents-of-a-folder-in-python#185941
import shutil
if DOWNLOAD_FOLDER_PATH:
    for file in os.listdir(DOWNLOAD_FOLDER_PATH):
        file_path = os.path.join(DOWNLOAD_FOLDER_PATH, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except OSError as e:
            print(e)

# DB
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_session = scoped_session(Session)

app.register_blueprint(social_auth)
init_social(app, db_session)

login_manager = login.LoginManager()
login_manager.login_view = 'main'
login_manager.login_message = ''
login_manager.init_app(app)

from backend import models
from backend import routes


@login_manager.user_loader
def load_user(userid):
    try:
        return models.user.User.query.get(int(userid))
    except (TypeError, ValueError):
        pass


@app.before_request
def global_user():
    g.user = login.current_user._get_current_object()


@app.teardown_appcontext
def commit_on_success(error=None):
    if error is None:
        db_session.commit()
    else:
        db_session.rollback()
    db_session.remove()


@app.context_processor
def inject_user():
    try:
        return {'user': g.user}
    except AttributeError:
        return {'user': None}


app.context_processor(backends)
