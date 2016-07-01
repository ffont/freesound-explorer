/* JSON requests */

function loadJSON(url, callback, error_callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(xhr.response);
        } else {
            if (error_callback){
                error_callback();
            }
        }
    };
    xhr.onerror = function(){
        if (error_callback){
            error_callback();
        }
    }
    xhr.send();
}

/* Access nested object attributes by string */
// Example usage: Object.byString(someObj, 'part3[0].name');
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                    o = o[k];
            } else {
                    return;
            }
    }
    return o;
}
