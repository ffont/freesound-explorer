function showSoundInfo(sound){
	/* show selected sound info in div */
    var html = '';
    html += sound.name + ' by <a href="' + sound.url + '" target="_blank">' + sound.username + '</a>';
    html += ' <a href="javascript:void(0);" onclick="bookmark_sound(' + sound.id + ');"><i class="fa fa-bookmark-o" aria-hidden="true"></a>';
    document.getElementById('sound_info_box').innerHTML = html;
}

function setMapDescriptor(){
	/* select and prepare audio descriptor to use for map */
    var selected_descriptor = document.getElementById('map_descriptors_selector').value;
    extra_descriptors = selected_descriptor;
    map_similarity_feature = selected_descriptor;
}

function showMessage(msg){
	document.getElementById('info_placeholder').innerHTML = msg;
}