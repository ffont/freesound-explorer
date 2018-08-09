from flask import Flask, render_template, jsonify, request, make_response, redirect, g, url_for, send_from_directory, send_file, after_this_request
from flask_login import login_required, logout_user
from social.apps.flask_app.default.models import UserSocialAuth
from backend import app, db_session
from social.exceptions import SocialAuthBaseException
from backend.models.session import Session
import json
import uuid
import datetime
import os
import urllib2
import base64
import zipfile
import io
import re
import threading
import time
import Queue # renamed to queue in python 3!

def is_valid_uuid(uuid_string):
    try:
        val = uuid.UUID(uuid_string)
    except ValueError:
        return False
    except TypeError:
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
    json.dump(file_contents, open(file_path, 'w'), indent=4)


    return make_response(jsonify(
        {'errors': False, 'sessionName': session_name, 'sessionID': session_id }), 200)

def get_available_sessions_for_user(user_id, username):
    sessions = Session.query.filter_by(user_id=user_id)
    user_sessions = [{
        'name': session.name,
        'id': session.id,
        'lastModified': session.last_modified.isoformat(),
        'author': username
    } for session in sessions]
    return user_sessions

def get_availavle_demo_sessions():
    demo_sessions = [{
        'name': ds_name,
        'id': ds_id,
        'lastModified': ds_modified,
        'author': ds_author
    } for ds_name, ds_id, ds_modified, ds_author, _ in demo_sessions_data]
    return demo_sessions

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

    return make_response(jsonify({
        'username': username,
        'userID': user_id,
        'errors': False,
        'userSessions': get_available_sessions_for_user(user_id, username),
        'demoSessions': get_availavle_demo_sessions()
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
        file_contents = json.load(open(file_path))
    else:
        # Demo session
        file_path = '%s/%s.json' % (app.config['DEMO_SESSIONS_FOLDER_PATH'], session_id)
        file_contents = json.load(open(file_path))
        file_contents['data']['session']['id'] = ''  # Ignore id (if any) so that session can't be saved in frontend (only 'saved as')

    return make_response(jsonify(file_contents), 200)


@app.route('/delete/')
def delete():
    # Deletes the session with given id (including json file)

    session_id = request.args.get('sid', None)
    if session_id is None or session_id == '':
        return make_response(jsonify({'errors': True, 'msg': 'No session id provided'}), 400)

    username = "AnonymousUser"
    user_id = 0
    if g.user.is_authenticated:
        username = g.user.username
        user_id = g.user.id

    if not user_id and not app.config['ALLOW_UNAUTHENTICATED_USER_DELETE']:
        # Unauthenticated users can't delete sessions
        return make_response(jsonify({'errors': True, 'msg': 'Unauthenticated user'}), 401)

    instance = Session.query.filter_by(id=session_id).first()
    if not instance:
        return make_response(jsonify({'errors': True, 'msg': 'Session not found'}), 400)

    if user_id != instance.user_id:
        return make_response(jsonify({'errors': True, 'msg': 'Unnauthorized user'}), 401)

    # Do delete...
    name = instance.name
    db_session.delete(instance)
    db_session.commit()
    file_path = '%s/%s/%s.json' % (app.config['SESSIONS_FOLDER_PATH'], instance.user_id, session_id)
    try:
        os.remove(file_path)
    except OSError:
        # No probme if file does not exist
        pass

    # Compute currently available sessions for the user (so that forntend does not need to
    # make an extra request to update the panel)
    user_sessions = get_available_sessions_for_user(user_id, username)
    demo_sessions = get_availavle_demo_sessions()

    return make_response(jsonify({'errors': False, 'name': name, 'id': session_id,
        'userSessions': user_sessions, 'demoSessions': demo_sessions }), 200)


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


@app.route('/download/', methods=['GET'])
def download():
    
    fsids = request.args.get('fsids', None).split(',')
    download_id = str(uuid.uuid4())
    default_path = os.getcwd()
    _, access_token = get_user_data()
    cleanup_array = []

    # setup folder
    prefix = os.path.join('./backend/audio/', download_id)
    os.mkdir(prefix)
    os.chdir(prefix)
    download_path = os.getcwd()
    
    zipname = 'FreesoundExplorer_' + download_id
    zipabs = os.path.join(download_path, zipname)
    cleanup_array.append(zipabs)

    zipf = zipfile.ZipFile(zipabs, "a")

    if len(fsids) == 0:
        zipf.close()
        os.chdir(default_path)
        return send_file(zipabs, as_attachment=True,  attachment_filename= zipname + '.zip')
   
   # setup zip
    # get filename and fileobj from freesound API and append to zip
    for id in fsids:
        url = "https://freesound.org/apiv2/sounds/{}/download/".format(id)
        urlrequest = urllib2.Request(url)
        urlrequest.add_header("Authorization", "Bearer {}".format(access_token))
        file = urllib2.urlopen(urlrequest)

        # get filename from request info
        fn = re.search(r'".*"', file.info()['Content-Disposition']).group(0)[1:-1]

        # write next audiofile received
        filepath = os.path.join(os.getcwd(), fn)
        cleanup_array.append(filepath)

        output = open(filepath ,'wb')
        output.write(file.read())
        output.close()
        zipf.write(fn, fn)

    zipf.close()
    download_size = os.path.getsize(zipabs)
    # reset current working diretory
    os.chdir(default_path)

    # open a new thread that waits for the download to finish (by thumb estimation)
    class ThreadClass(threading.Thread):
        def run(self):
            # rough estimation of download time with min 2 Mbit/sec
            waiting_time = download_size/200000
            print('!! waiting time: ' + str(waiting_time)) 
            time.sleep(waiting_time)
            for path in cleanup_array:
                os.remove(path)
            os.rmdir(os.path.dirname(cleanup_array[0]))
            return

    @after_this_request
    def delayed_cleanup(res):
        print("! afterrequest called")
        cleanup_thread = ThreadClass(group=None)
        cleanup_thread.start()
        return res

    return send_file(zipabs, as_attachment=True,  attachment_filename= zipname + '.zip')
