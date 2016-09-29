import os

DEBUG = False
USE_JS_DEV_SERVER = True
SECRET_KEY = 'secret_key'
SESSION_COOKIE_NAME = 'psa_session'
SQLALCHEMY_DATABASE_URI = 'sqlite:////%s/fse_db.db' % os.path.dirname(os.path.abspath(__file__))
DEBUG_TB_INTERCEPT_REDIRECTS = False
SESSION_PROTECTION = 'strong'
CUSTOM_STATIC_FOLDER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),"..","static"))

ALLOW_UNAUTHENTICATED_USER_SAVE_LOAD = False
ALLOW_UNAUTHENTICATED_USER_DELETE = False
DEMO_SESSIONS_FOLDER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),"demo_sessions"))
SESSIONS_FOLDER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),"sessions"))
if not os.path.exists(SESSIONS_FOLDER_PATH): os.mkdir(SESSIONS_FOLDER_PATH)

SOCIAL_AUTH_LOGIN_URL = '/'
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/done/'
SOCIAL_AUTH_USER_MODEL = 'backend.models.user.User'
SOCIAL_AUTH_AUTHENTICATION_BACKENDS = ('backend.freesound_auth.FreesoundAuth', )

FREESOUND_CLIENT_ID = "YOUR_CLIENT_ID"
FREESOUND_CLIENT_SECRET = "YOUR_CLIENT_SECRET"
FREESOUND_FORCE_LOGIN = True
