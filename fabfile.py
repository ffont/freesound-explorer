"""
Deploy Freesound Explorer to labs.freesound.org (required Pythons's fabric installed)
"""


from __future__ import with_statement
from fabric.api import *
from fabric.contrib.files import put

env.hosts = ['ffont@fs-labs.s.upf.edu']
remote_dir = '/homedtic/ffont/apps/freesound-explorer'

def __copy_static():
    with cd(remote_dir):
        put("static/js/bundle.js", remote_dir + '/static/js/')

def __pull():
    # Pull del repo de git
    with cd(remote_dir):
        run("git pull")

def deploy():
	__pull()
	__copy_static()
    # NOTE: if needed, backend restart must be done manually
