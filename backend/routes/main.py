from flask import Flask, render_template, jsonify, request, make_response, redirect, g, url_for, send_from_directory
from flask_login import login_required, logout_user
from social.apps.flask_app.default.models import UserSocialAuth
from backend import app, db_session
from social.exceptions import SocialAuthBaseException
from backend.models.session import Session
import json
import uuid
import datetime
import os


def is_valid_uuid(uuid_string):
    try:
        val = uuid.UUID(uuid_string)
    except ValueError:
        return False
    return True

demo_sessions_data = []
def load_demo_sessions_data():
    for filename in [f for f in os.listdir(app.config['DEMO_SESSIONS_FOLDER_PATH']) if f.endswith('.json')]:
        file_path = '%s/%s' % (app.config['DEMO_SESSIONS_FOLDER_PATH'], filename)
        file_contents = json.load(open(file_path, 'r'))
        demo_sessions_data.append((
            file_contents['data']['session']['name'],
            filename.replace('.json', ''),  # Use filename instead of id
            file_contents['lastModified'],
            file_contents['data']['session']['author'],
            file_contents
        ))

# On start load demo sessions data (only run once)
load_demo_sessions_data()

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
    is_back_end_available = True
    return render_template('index.html', use_js_dev_server=use_js_dev_server,
        is_back_end_available=is_back_end_available)


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

    # Create object in db
    session_id = request.args.get('sid', None)
    if not is_valid_uuid(session_id):
        session_id = None  # Session id comes from demo session, we create new version with new id
    if session_id is not None:
        instance = Session.query.filter_by(id=session_id).first()
        if not instance:
            return make_response(jsonify({'errors': True, 'msg': 'Session not found'}), 400)
        # If user is not the same as the one that created the session, add a new id and update
        # existing user id (this will effectively create a new session object)
        if user_id != instance.user_id:
            session_id = str(uuid.uuid4())
            instance.id = session_id
            instance.user_id = user_id
    else:
        # Should create a new session
        session_id = str(uuid.uuid4())
        instance = Session(id=session_id, user_id=user_id)
        instance.created = datetime.datetime.utcnow()

    data['session']['author'] = username
    if data['session']['name']:
        session_name = data['session']['name']
    else:
        n_existing_sessions = Session.query.filter_by(user_id=user_id).count()
        session_name = 'Untitled session #%i' % (n_existing_sessions + 1)
        data['session']['name'] = session_name
    instance.name = session_name
    instance.last_modified = datetime.datetime.utcnow()
    db_session.add(instance)
    db_session.commit()

    file_dir = '%s/%i' % (app.config['SESSIONS_FOLDER_PATH'], user_id)
    file_path = '%s/%s.json' % (file_dir, session_id)
    if os.path.exists(file_path):
        file_contents = json.load(open(file_path, 'r'))
    else:
        file_contents = {
            'id': session_id,
            'username': username,
            'data': [],
            'created': datetime.datetime.now().isoformat(),
        }
    file_contents['lastModified'] = datetime.datetime.now().isoformat()
    file_contents['data'] = data

    # Save session file
    if not os.path.exists(file_dir):
        os.mkdir(file_dir)
    json.dump(file_contents, open(file_path, 'w'))


    return make_response(jsonify(
        {'errors': False, 'sessionName': session_name, 'sessionID': session_id }), 200)

@app.route('/available/')
def available():
    # Returns a list of available sessions for the logged user (or AnonymousUser)
    username = "AnonymousUser"
    user_id = 0
    if g.user.is_authenticated:
        username = g.user.username
        user_id = g.user.id

    if user_id == 0 and not app.config['ALLOW_UNAUTHENTICATED_USER_SAVE_LOAD']:
        return make_response(jsonify({'errors': True, 'msg': 'Unauthenticated user'}), 401)

    # Add demo sessions
    demo_sessions = [{
        'name': ds_name,
        'id': ds_id,
        'lastModified': ds_modified,
        'author': ds_author
    } for ds_name, ds_id, ds_modified, ds_author, _ in demo_sessions_data]

    # Add user sessions
    sessions = Session.query.filter_by(user_id=user_id)
    user_sessions = [{
        'name': session.name,
        'id': session.id,
        'lastModified': session.last_modified.isoformat(),
        'author': username
    } for session in sessions]

    return make_response(jsonify({
        'username': username,
        'userID': user_id,
        'errors': False,
        'userSessions': user_sessions,
        'demoSessions': demo_sessions
    }), 200)


@app.route('/load/')
def load():
    # Returns the contents of the session file
    session_id = request.args.get('sid', None)
    if session_id is None or session_id == '':
        return make_response(jsonify({'errors': True, 'msg': 'No session id provided'}), 400)

    if is_valid_uuid(session_id):
        # Session stored in db
        instance = Session.query.filter_by(id=session_id).first()
        if not instance:
            return make_response(jsonify({'errors': True, 'msg': 'Session not found'}), 400)

        file_path = '%s/%s/%s.json' % (app.config['SESSIONS_FOLDER_PATH'], instance.user_id, session_id)
        if not os.path.exists(file_path):
            return make_response(jsonify({'errors': True, 'msg': 'Session data could not be found'}), 400)
    else:
        # Demo session
        print session_id
        file_path = '%s/%s.json' % (app.config['DEMO_SESSIONS_FOLDER_PATH'], session_id)

    file_contents = json.load(open(file_path))
    return make_response(jsonify(file_contents), 200)


@app.route('/delete/')
def delete():
    # Deletes the session with given id (including json file)

    session_id = request.args.get('sid', None)
    if session_id is None or session_id == '':
        return make_response(jsonify({'errors': True, 'msg': 'No session id provided'}), 400)

    if not g.user.is_authenticated:
        # Unauthenticated users can't delete sessions
        return make_response(jsonify({'errors': True, 'msg': 'Unauthenticated user'}), 401)

    instance = Session.query.filter_by(id=session_id).first()
    if not instance:
        return make_response(jsonify({'errors': True, 'msg': 'Session not found'}), 400)

    if g.user.id != instance.user_id:
        return make_response(jsonify({'errors': True, 'msg': 'Unnauthorized user'}), 401)

    # Do delete...
    db_session.delete(instance)
    db_session.commit()
    file_path = '%s/%s/%s.json' % (app.config['SESSIONS_FOLDER_PATH'], session.user_id, session_id)
    try:
        os.remove(file_path)
    except OSError:
        # No probme if file does not exist
        pass

    return make_response(jsonify({'errors': False}), 200)


@app.route('/logout/')
def logout():
    logout_user()
    return make_response(jsonify({'logged': False }), 200)


def get_user_data():
    username = None
    access_token = None
    if g.user.is_authenticated:
        username = g.user.username
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
        'accessToken': access_token,
        'logged': g.user.is_authenticated,
        }), 200)


@app.route('/get_app_token/')
def get_app_token():
    username, access_token = get_user_data()
    return make_response(jsonify({
        'appToken': app.config['FREESOUND_CLIENT_SECRET']
        }), 200)
