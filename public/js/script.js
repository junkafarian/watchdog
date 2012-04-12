var socket = io.connect('http://localhost:3003');

function update_or_append_status(username, status) {
    $('.status-container[rel='+username+']').each(function (i,el) {el.innerHTML = status.status; console.log(el)});
}

socket.on('status_update', function (data) {
    var to_update = document.getElementsByClassName("status-container");
    for (var k in data) {
        var status = data[k];
        update_or_append_status(status.username, status.status)
    }
});
