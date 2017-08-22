# Freesound Explorer

[http://labs.freesound.org/fse/](http://labs.freesound.org/fse/)


![Dependencies](https://david-dm.org/ffont/freesound-explorer.svg)

[Freesound Explorer](http://labs.freesound.org/fse/) is a visual interface for exploring [Freesound](https://freesound.org) in a 2-dimensional space and create music at the same time :)
Using Freesound Explorer you can perform text-based queries in Freesound, and see the results arranged in a 2-dimensional space. We usa a well known dimensionality reduction technique ([tSNEJS](https://github.com/karpathy/tsnejs)) and learn the space from spectral audio features provided by Freesound. In this way, sounds are self-organised according to some sort of timbre similarity.

Freesound Explorer is implemented as a web application which takes advantage of modern web technologies including the [Web Audio API](https://www.w3.org/TR/webaudio/) and the [Web MIDI API](https://www.w3.org/TR/webmidi/). Freesound Explorer also uses a Python [Flask](http://flask.pocoo.org) backend for handling user accounts, but it can also be run statically without the backend (with reduced functionality and no user handling).

More information can be found in the [demo paper](http://eecs.qmul.ac.uk/~keno/20.pdf) that we presented at the Web Audio Conference 2017 held at Queen Mary University of London.

Freesound Explorer has been (so far) developed by Frederic Font and Giuseppe Bandiera, researchers at the [Music Technology Group](http://mtg.upf.edu) of Universitat Pompeu Fabra, Barcelona.


![Freesound Explorer Screenshot 1](https://cloud.githubusercontent.com/assets/478615/24897804/9122f2a8-1e9a-11e7-913a-2580acbf89be.png?raw=true "Freesound Explorer Screenshot 1")

![Freesound Explorer Screenshot 2](https://cloud.githubusercontent.com/assets/478615/24897793/897463ca-1e9a-11e7-9182-c6b4ff55ea5b.png?raw=true "Freesound Explorer Screenshot 2")


# Development

Want to get involved in the development? We welcome contributions :) Here are some instructions to set up the development environment:

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

To run the tests, run:
```
npm test
```

## Back-end
To run the Flask server (for enabling Freesound user auth), you will need to create a new virtualenv and install all the dependencies:
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

# Citations

To cite Freesound explorer please use the following refernece:

[Font, F., & Bandiera G. (2017).  Freesound Explorer: Make Music While Discovering Freesound!. Web Audio Conference (WAC 2017). ](http://eecs.qmul.ac.uk/~keno/20.pdf)

# License
MIT

The MIDI controller icon we use has been created by [Daouna Jeong](https://thenounproject.com/search/?q=midi&i=145742) and
is released under Creative Commons By 3.0 license.
