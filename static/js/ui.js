var waveform_timer = undefined;
function showSoundInfo(sound){
	clearTimeout(waveform_timer); // Just in case there was a timeout running

	/* show selected sound info in div */
    var html = '';

    // Waveform placeholder
    html += '<div id="waveform"><div class="waveform-svg"></div></div>';

    // Sound info
    html += sound.name + ' by <a href="' + sound.url + '" target="_blank">' + sound.username + '</a>';
    if (supports_end_user_auth){
    	html += ' <a href="javascript:void(0);" onclick="bookmark_sound(' + sound.id + ');"><i class="fa fa-bookmark-o" aria-hidden="true"></i></a>';
    }
    document.getElementById('sound_info_box').innerHTML = html;

    // Should show waveform only if buffer has loaded
    // Temporary fix: setTimeout to give enough time for the buffer to load
    if (sound.buffer != undefined){
    	showWaveform(sound);
    } else {
    	setTimeout(function(){
    			showWaveform(sound);
    		}, 1000)
    }
}

function setMapDescriptor(){
	/* select and prepare audio descriptor to use for map */
    var selected_descriptor = document.getElementById('map-descriptors-selector').value;
    extra_descriptors = selected_descriptor;
    map_similarity_feature = selected_descriptor;
}

var message_timer = undefined;
function showMessage(msg, type, time){
	clearTimeout(message_timer);  // Clear timeout if there is one set

	if (time == undefined)
		time = 2000;
	if (type == undefined)
		type = "info";

	var html = "";
	if (type == "info")
		html += '<i class="fa fa-info-circle" aria-hidden="true"></i>';
	html += '&nbsp;&nbsp;' + msg;
	document.getElementById('info-placeholder').innerHTML = html;
	document.getElementById('messages-box').style.display = 'block';  // Show message box

	if (time > 0){  // Set timeout if indicated in time parameter
		message_timer = setTimeout(
			function(){
				document.getElementById('messages-box').style.display = 'none';  // Hide message box
			}, time)
	}
}
