# Freesound Explorer

Visual interface for exploring Freesound content in a 2-dimensional space and create music :)
For each query, a dimensionality reduction Javascript library ([tSNEJS](https://github.com/karpathy/tsnejs)) is used for arranging the sounds in the 2-dimensional space.

Freesound Explorer uses a python [Flask](http://flask.pocoo.org) backend for handling user accounts, but it can also be run statically without the backend (with reduced functionality and no user handling). You can try the "reduced" Freesound Explorer here: [https://ffont.github.io/freesound-explorer/](https://ffont.github.io/freesound-explorer/)

# Development
## Front-end
First use
```
npm install
```
to install all the dependencies.

Then run
```
npm run dev
```
to start an express server that simulates the client-only environment with hot reloading.

If you want to generate the production build, run:
```
npm run build
```

## Back-end
To run the flask server (for enabling Freesound user auth), you will need to create a new virtualenv and install all the dependencies:
```
pip install -r requirements.txt
```
Then create a new `settings.py` file in the main project directory by editing the original `settings.example.py` according to your development environment. Finally run:
```
python manage.py syncdb
python manage.py runserver
```
Note that `python manage.py syncdb` will probably be required only the first time. If you want to use the flask server while dinamically serving the JS bundle with webpack, run:
```
npm run with-flask
```
(instead of `npm run dev`) and ensure you have `USE_JS_DEV_SERVER=True` in your `settings.py`. This will make the flask server correctly load the bundle served at port 8080 (and with hot reloading) by webpack.

# License
MIT
