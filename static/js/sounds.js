function SoundFactory(id, preview_url, analysis, url, name, username, fs_object){
    /* function to create sound objects from data */
    var this_sound = this; // Useful for functions that use callbacks
    this.svg_object = undefined;
    this.x =  0.0;
    this.y =  0.0;
    this.selected = false;
    this.playing = false;
    this.is_buffer_loading = false;
    this.buffer = undefined;
    
    this.id = id;
    this.preview_url = preview_url;
    this.analysis = analysis;
    this.url = url;
    this.name = name;
    this.username = username;
    this.rgba = rgbToHex(
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][0]),
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][1]),
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][2])
    )
    this.fs_object = fs_object;

    this.onmouseover = function(){
        this.svg_object.style("stroke", sound_selected_colour);
        if (hover_playing_mode){
            this.play();
        }
    };

    this.onmouseout = function(){
        this.svg_object.style("stroke", this.rgba);
    };

    this.onclick = function(){
        var next_selected_value = !this.selected;
        if (this.playing){
            this.stop();
        }
        unselectAllSounds();
        if (next_selected_value){
            this.play();
            this.select();
        }
    };

    this.select = function(){
        this.selected = true;
        showSoundInfo(this);
        this.updateDisplay();
    }

    this.unselect = function(){
        this.selected = false;
        this.updateDisplay();
    }

    this.play = function(){
        if (!this.playing){
            if (this.buffer == undefined){
                this.loadSound(play_once_loaded=true);
            } else {
                this.playing = true;
                // In web audio api, a new AudioBufferSourceNode is meant to be created
                // and connected to the audio graph every time we want to play a buffer
                this.source = audio_context.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.connect(audio_context.gainNode);
                this.source.onended = function(){
                    this_sound.stop();
                }
                this.source.start(0);
            }  
        }
        this.updateDisplay();
    }

    this.stop = function(){
        if (this.playing){
            this.playing = false;
            this.source.stop(0);    
        }        
        this.svg_object.transition().duration(200).ease('sine').attr("r", default_radius/2);
        this.updateDisplay();
    }

    this.updateDisplay = function(){
        if (this.selected){
            this.svg_object.style("fill", sound_selected_colour);
            this.svg_object.style("fill-opacity", 1.0);
        } else {
            this.svg_object.style("fill", this.rgba);
            this.svg_object.style("fill-opacity", default_opacity);
        }

        if (this.playing){
            playingAnimation(this.svg_object);
            this.svg_object.style("fill", sound_playing_colour);
        } else {
            // playing animation will be stopped on stop
            this.svg_object.style("fill", this.rgba);
        }
    }

    this.loadSound = function(play_once_loaded){
        if (!this.is_buffer_loading){
            this.is_buffer_loading = true;
            buffer_loader = new BufferLoader(this.preview_url, 
                function() {  // callback ok
                    // Once loaded, assign buffer to sound object
                    this_sound.buffer = buffer_loader.buffer;
                    console.log('Loaded sound ' + this_sound.id + ': ' + this_sound.preview_url);
                    if (play_once_loaded){
                        this_sound.play();
                    }
                },
                function() {  // callback error
                    this.is_buffer_loading = false;
                }
            );
        }
    }
}

function playingAnimation(svg_object) {
    /* Transitions to be carried out when sound is playing */
    (function repeat() {
        svg_object = svg_object.transition()
            .duration(500)
            .attr("r", default_radius/1.5)
            .transition()
            .duration(500)
            .attr("r", default_radius/2)
            .ease('sine')
            .each("end", function(d){
                if (d.playing){
                    repeat();    
                }
            });
    })();
}

function unselectAllSounds(){
    /* Set all sounds to unselected */
    svg.selectAll('.sound_point').each(function(d){d.unselect(d3.select(this));});
}

function selectSound(sound_id){
    return selectPoint(sound_id).__data__
}
