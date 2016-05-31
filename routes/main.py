from flask import Flask, render_template, jsonify, request, make_response, redirect, g, url_for
from flask_login import login_required, logout_user
from social.apps.flask_app.default.models import UserSocialAuth
from FreesoundExplorer import app
import settings
import json


@app.route('/')
def index():
    return render_template('index.html')


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
            access_token = UserSocialAuth.get_social_auth_for_user(g.user).filter(UserSocialAuth.provider=="freesound").first().access_token
        except AttributeError:
            pass
    return username, access_token


@app.route('/done/')  # View called when login is done
def done():
    username, access_token = get_user_data()
    return render_template('logged.html', access_token=access_token, username=username)


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
    return make_response(jsonify({ 'app_token': settings.FREESOUND_CLIENT_SECRET }), 200)
