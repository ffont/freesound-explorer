from flask import Flask, render_template, jsonify, request, make_response, redirect, g, url_for, send_from_directory
from flask_login import login_required, logout_user
from social.apps.flask_app.default.models import UserSocialAuth
from backend import app
from social.exceptions import SocialAuthBaseException
import json
import uuid
import datetime
import os


# Reoute to serve static files from a folder outside the flask app package
@app.route('/static/<path:filename>')
def custom_static(filename):
    return send_from_directory(app.config['CUSTOM_STATIC_FOLDER_PATH'], filename)


@app.errorhandler(500)
def error_handler(error):
    # See https://github.com/omab/python-social-auth/blob/master/docs/configuration/flask.rst#exceptions-handling
    if isinstance(error, SocialAuthBaseException):
        return render_template('failed_login.html')


@app.route('/')
def index():
    use_js_dev_server = app.config['USE_JS_DEV_SERVER']
    return render_template('index.html', use_js_dev_server=use_js_dev_server)


# Example curl post: curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz",
# "password":"ssxeeyzddff"}' localhost:5000/save/?sid=6f518618-22c2-4786-b591-d656631f6778
@app.route('/save/', methods=['POST'])
def save():
    username = "AnonymousUser"
    user_id = 0
    if g.user.is_authenticated:
        username = g.user.username
        user_id = g.user.id

    if user_id == 0 and not app.config['ALLOW_UNAUTHENTICATED_USER_SAVE_LOAD']:
        return make_response(jsonify({'errors': True, 'msg': 'Unauthenticated user'}), 401)

    try:
        data = json.loads(request.data)
    except ValueError:
        return make_response(jsonify({'errors': True, 'msg': 'No posted data or posted data not readable'}), 400)

    session_id = request.args.get('sid', str(uuid.uuid4()))
    file_dir = '%s/%i' % (app.config['SESSIONS_FOLDER_PATH'], user_id)
    file_path = '%s/%s.json' % (file_dir, session_id)
    if os.path.exists(file_path):
        file_contents = json.load(open(file_path, 'r'))
    else:
        file_contents = { 'id': session_id, 'username': username, 'data': [] }
    # Append tuple with timestamp and current session data (in this way we keep versions of
    # the session sorted by timestamp)
    file_contents['data'].append((str(datetime.datetime.now()), data))

    if not os.path.exists(file_dir):
        os.mkdir(file_dir)
    json.dump(file_contents, open(file_path, 'w'))
    return make_response(jsonify({'errors': False, 'sessionID': session_id }), 200)


@app.route('/load/')
def load():
    username = "AnonymousUser"
    user_id = 0
    if g.user.is_authenticated:
        username = g.user.username
        user_id = g.user.id

    if user_id == 0 and not app.config['ALLOW_UNAUTHENTICATED_USER_SAVE_LOAD']:
        return make_response(jsonify({'errors': True, 'msg': 'Unauthenticated user'}), 401)

    user_sessions_file_contents = []
    user_sessions_folder_path = '%s/%i' % (app.config['SESSIONS_FOLDER_PATH'], user_id)
    for session_filename in [item for item in os.listdir(user_sessions_folder_path) \
                                                                    if item.endswith('.json')]:
        file_contents = json.load(open('%s/%s' % (user_sessions_folder_path, session_filename)))
        user_sessions_file_contents.append(file_contents)

    return make_response(jsonify({
        'username': username,
        'errors': False,
        'sessions': user_sessions_file_contents
    }), 200)


@app.route('/logout/')
def logout():
    logout_user()
    return make_response(jsonify({'logged': False }), 200)


def get_user_data():
    username = None
    access_token = None
    if g.user.is_authenticated:
        username = g.user.username
        if include_access_token:
            try:
                access_token = UserSocialAuth.get_social_auth_for_user(g.user) \
                    .filter(UserSocialAuth.provider=="freesound") \
                    .first().access_token
            except AttributeError:
                pass
    return username, access_token


@app.route('/done/')  # View called when login is done
def done():
    username, access_token = get_user_data()
    return render_template('logged.html',
                            access_token=access_token,
                            username=username)


@app.route('/prepare_auth/')
def prepare_auth():
    username, access_token = get_user_data()
    return make_response(jsonify({
        'username': username,
        'access_token': access_token,
        'logged': g.user.is_authenticated,
        }), 200)


@app.route('/get_app_token/')
def get_app_token():
    username, access_token = get_user_data()
    return make_response(jsonify({
        'app_token': app.config['FREESOUND_CLIENT_SECRET']
        }), 200)
