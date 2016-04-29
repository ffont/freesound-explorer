var previous_move_x = 0;
var previous_move_y = 0;
var start_mouse_down_time = 0;


function onMouseDown(event){
    var d = new Date();
    start_mouse_down_time = d.getTime();
    previous_move_x = event.pageX;
    previous_move_y = event.pageY;
    canvas.addEventListener("mousemove", onMouseMove, false);
}

function onMouseUp(event){
    canvas.removeEventListener("mousemove", onMouseMove, false);
    previous_move_x = 0;
    previous_move_y = 0;

    var d = new Date();
    current_click_time = d.getTime();
    if ((current_click_time - start_mouse_down_time) < 200){
        click_x = event.pageX;
        click_y = event.pageY;
        var norm_click_x = 0;
        var norm_click_y = 0;
        [norm_click_x, norm_click_y] = displayCoordsToNormCoords(click_x, click_y);
        checkSelectSound(norm_click_x, norm_click_y);
    }
}

function onMouseOut(event){
    canvas.removeEventListener("mousemove", onMouseMove, false);
    previous_move_x = 0;
    previous_move_y = 0;
}

function onMouseMove(event){
    var zoomMode = event.altKey;
    var rotateMode = event.shiftKey;
    var playMode = event.metaKey;

    // Compute translation delta
    delta_x = event.pageX - previous_move_x;
    delta_y = event.pageY - previous_move_y;
    previous_move_x = event.pageX;
    previous_move_y = event.pageY;
    
    if (zoomMode) {
        zoom_factor -= delta_y * 0.05; //delta_zoom / ((w + h)/2);
        if (zoom_factor < 0.3) {
            zoom_factor = 0.3;
        } else if (zoom_factor > 8){
            zoom_factor = 8;
        }
    }

    if (rotateMode){
        rotation_degrees += delta_y * 0.01; //delta_zoom / ((w + h)/2);
    }

    if ((!zoomMode) && (!rotateMode) && (!playMode)) {
        var sin = Math.sin(-rotation_degrees);
        var cos = Math.cos(-rotation_degrees);
        var delta_x_r = delta_x * cos - delta_y * sin;
        var delta_y_r = delta_x * sin + delta_y * cos;
        center_x -= delta_x_r / (disp_scale * zoom_factor);
        center_y -= delta_y_r / (disp_scale * zoom_factor);  
    }

    if (playMode){
        var pos_x = 0;
        var pos_y = 0;
        [pos_x, pos_y] = displayCoordsToNormCoords(event.pageX, event.pageY);
        checkSelectSound(pos_x, pos_y);  
    }
    
    // Stop after X seconds of inactivity
    // cancel timeout 
    // Set time out
}
