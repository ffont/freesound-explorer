<h1 align=center>
<img alt="Freesound Explorer" src="logo/1000px horizontal.svg" width=90% href="https://labs.freesound.org/fse/](http://labs.freesound.org/fse/">
</h1>


[https://labs.freesound.org/fse/](http://labs.freesound.org/fse/) (use Chrome for better experience)



## About

[Freesound Explorer](https://labs.freesound.org/fse/) is a visual interface for exploring [Freesound](https://freesound.org) in a 2-dimensional space and create music at the same time :)
Using Freesound Explorer you can perform text-based queries in Freesound, and see the results arranged in a 2-dimensional space. We use a well known dimensionality reduction technique ([tSNEJS](https://github.com/karpathy/tsnejs)) and learn the space from spectral audio features provided by Freesound. In this way, sounds are self-organised according to some sort of timbre similarity.

Freesound Explorer is implemented as a web application which takes advantage of modern web technologies including the [Web Audio API](https://www.w3.org/TR/webaudio/) and the [Web MIDI API](https://www.w3.org/TR/webmidi/). Freesound Explorer also uses a Python [Flask](http://flask.pocoo.org) backend for handling user accounts, but it can also be run statically without the backend (with reduced functionality and no user handling).

More information can be found in the [demo paper](http://eecs.qmul.ac.uk/~keno/20.pdf) that we presented at the Web Audio Conference 2017 held at Queen Mary University of London.

Freesound Explorer has been (so far) developed by Frederic Font and Giuseppe Bandiera, researchers at the [Music Technology Group](http://mtg.upf.edu) of Universitat Pompeu Fabra, Barcelona and Eric Lehmann, masters student of [Film University Babelsberg KONRAD WOLF](https://filmuniversitaet.de/en/).






## Tutorial/How to use

### 1) Search sounds

* Click on the "Search" icon in the sidebar and type any query terms. Adjust the number of results and maximum duration of the retrieved sounds. 

* Once you submit the query, Freesound Explorer will **get matching sounds from Freesound** and will show the results in the map area.

  **NOTE:** The more sounds are requested, the slower will be the response from Freesound and the computation of the map.

  **TIP**: try using query terms that might result in sounds with different timbre qualities. For example, raise to number of sounds to ~200 and search for the keyword *Bells*. 

  <img width="954" alt="Example of a typical result presentation" src="https://user-images.githubusercontent.com/19167028/44712851-046db780-aab2-11e8-8508-4ef96a56ddc9.png">



  The result will always be first N-matches of the results page. Changing the "Sort By" prameter will change the sounds. 

  In the example below, the 200 most downloaded sounds tagged "bells" are returned.

  <img width="954" alt="Changing the 'Sort by' parameter results in different sounds" src="https://user-images.githubusercontent.com/19167028/44712850-046db780-aab2-11e8-8507-2ed154c5b1c6.png">



### 2) Explore the map of sounds

* Sounds (represented as points in the map) are **organised according to timbre similarity**. This means that sounds appearing closer in the map should sound similar that sounds appearing far away. Use your mouse/trackpad to move around the map and zoom in/out.

  **TIP:** is another organisational principle available: Tonality. You need to specify it before submitting your search terms. This will result in clusters of pitch classes, meaning all sounds of the same key regardless of the octave (eg. D1, D2, D3 ...) are close to each other. This can be really useful if you plan to play the sounds with a sampler.

* **Click on the sounds** to listen to them and open an info box displaying some extra information. If you are logged in, you can download the sounds via the info panel. For selecting and downloading multiple sounds just hold shift to select more than one and use the **batch download button** appearing at the sidebar menu.

<img width="954" alt="The batch download button appears at the navigation bar when selecting multiple sounds" src="https://user-images.githubusercontent.com/19167028/44714172-ec4b6780-aab4-11e8-8769-f795d85d4251.png">

A click on this button will download a zip archive, including all original audio files and a CSV file with all relevant freesound metadata. You will have to wait a certain amount of time for the backend collecting the sounds. Your browser will automatically store the archive to the download folder as soon as this process is finished

* Hold down the ALT key and move your mouse to **play sounds on hover**. This will allow you to quickly grasp which kinds of sounds are projected at different parts of the map. A click on the empty map should stop all playing sounds, note that this behaviour is still a little unreliable.
* The color of the sounds also has a relation with its timbral qualities (we use the [Tristimulus](http://essentia.upf.edu/documentation/reference/std_Tristimulus.html) audio descriptor mapped to R, G, B color components.



To save some time listening through the whole map, you can have a look at the Cluster Tags. These add some information about frequently used tags in a sub cluster. Just press "T"on your keyboard if you want to free the view.

<img width="954" alt="cluster-tags" src="https://user-images.githubusercontent.com/19167028/44714880-b4452400-aab6-11e8-91a4-539d326371cf.png">



### 3) Inspect the results in the Sound-List tab

To have some more details about the sounds of a space, you can hit the next icon below. Here you can sort the table by clicking on the column header. Hovering over and selection of sounds are synchronized with the map view for better orientation. Available columns include name, duration, license, tags and username. 

### <img width="953" alt="sound-list" src="https://user-images.githubusercontent.com/19167028/44713525-988c4e80-aab3-11e8-876e-2596d635bed9.png">



### 4) Search for more sounds

* You are not limit to just a single query. If you do more queries, their results will be projected in a new **Space** in the map. A Space is simply a specific region of the map which holds to results of a specific query. Zooming out enough in the map will reveal all the Spaces arranged in a grid. It is possible to abort a search by pressing **ESC** during calculation. The corresponding space will be instatly deleted. To speed up the map calculation you can disable the animation by pressing the SPACE bar during calculation.

* Click on the "Spaces" icon in the sidebar (the one with the 4 squares in a grid) to see a list of all the Spaces you have created. 

<img width="954" alt="spaces" src="https://user-images.githubusercontent.com/19167028/44713746-0cc6f200-aab4-11e8-95f7-347a4aeaacfa.png">



### 5) Create sound paths

* Once you have some sounds on the map you can create **Paths** of sounds (or *playlists*) that later you can use to play them in sync.

* Click on the "Paths" icon in the sidebar (the one with the two arrows) and create a path by clicking in the **New Path** button.

* You can then start adding sounds to the path by clicking on **Add random sound**. This will add a sound randomly chosen form the last currently selected space.

* Alternatively, you can add a sound of your choice by clicking on the corresponding point (which will open the info box) and then clicking on **Add to path** option.

<img width="953" alt="paths" src="https://user-images.githubusercontent.com/19167028/44714678-31bc6480-aab6-11e8-92a7-79ed137d8a9f.png">



### 6) Play sound Paths

* Once you have created at least one sound path you can clik its play button and the sounds will start to be played in sequence.

* You can start the **global metronome** using the "Play" button at the bottom right of the map and all sounds from the paths will then be played in sync with the global metronome. This means that sounds will only be triggered at "correct" beat positions.

* Use the different sync options to trigger sounds at different subdivisions of the global tempo and to select whether or not to allow overlapping of sounds of a single Path.

<img src="https://user-images.githubusercontent.com/478615/29562417-1e5fda88-8731-11e7-9fa0-014228fbc9da.png?raw=true" alt="Freesound Explorer Sync Settings" title="Freesound Explorer Sync Settings" width=320>

* **TIP**: create some Paths and assign some sounds randomly. Then start the metornome and play all the paths at the same time with different sync settings. If it does not sound good enough, just add more sounds/paths ;)



### 7) Use MIDI input (Chrome only)

* If you have a MIDI controller or some other software generating MIDI messages, you can use it as input for the Freesound Explorer.

* Click on the "MIDI" icon in the sidebar (the one with the small MIDI controller) and chose your input device and midi channel.

* Open the info box of a sound and click on the **MIDI** button. Then press a key in your controller (send a note MIDI message). Freesound Explorer will map the selected sound with the pressed key. Now you can press other keys of the controller and the mapped sound will be played with different playback speeds according to the distance from the root note.

* You can map multiple sounds to different keys. When pressing a key with no directly mapped sound, the closest mapped sound will be played with the playback speed modified accordingly.

* **TIP**: Search for sounds with the name of an instrument and the "single-note" query term to get results of recordings of single notes. The simply MIDI learn one of the notes and you'll have a full new instrument to play ;)

<img src="https://user-images.githubusercontent.com/478615/29562416-1e5be20c-8731-11e7-9b8c-3d58826f7a4c.png?raw=true" alt="Freesound Explorer MIDI Learn" title="Freesound Explorer MIDI Learn" width=520>



### 8) Save your session

* Click on the "Settings" icon in the sidebar (the one with the wheel") and use the buttons there to save and load sessions.

* To save and load sessions, you need a Freesound account and need to **log in with your Freesound credentials** clicking on the user icon in the top right corner of Freesound Explorer.

* Sessions include all the sounds, Spaces and Paths that you have searched/created.



## Development

![Dependencies](https://david-dm.org/ffont/freesound-explorer.svg)

Want to get involved in the development? We welcome contributions :) Here are some instructions to set up the development environment:

### Front-end
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

### Back-end
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

## Citations

To cite Freesound explorer please use the following refernece:

[Font, F., & Bandiera G. (2017).  Freesound Explorer: Make Music While Discovering Freesound!. Web Audio Conference (WAC 2017). ](http://eecs.qmul.ac.uk/~keno/20.pdf)

## License
MIT

The MIDI controller icon we use has been created by [Daouna Jeong](https://thenounproject.com/search/?q=midi&i=145742) and
is released under Creative Commons By 3.0 license.

Our logos were designed by [Mirza Zulfan](https://github.com/mirzazulfan).