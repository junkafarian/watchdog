var socket = io.connect('http://localhost:3003');

var status_template = "<p class=\"status-line\" rel=\"{{username}}\"><a href=\"/status/{{username}}\">{{username}}</a>: <span class=\"status-container\">{{status}}</span></p>"

function update_or_append_status(list, username, status) {
    var line = list.find('.status-line[rel='+username+']');
    console.log(line);
    if (!line.length) {
        // there is no line in the parent element
        var newline = $(status_template)
            .attr('rel', username)
            .find('a')
            .each(function() {
                $(this)
                    .attr('href', '/status/'+username)
                    .text(username);
            })
            .end()
            .find('.status-container')
            .each(function() {
                $(this).text(status);
            })
                .end();
        
        newline.appendTo(list);
    } else {
        line.find('.status-container').each(function () {
            $(this).text(status);
            console.log(el);
        });
    }
}

socket.on('status_update', function (data) {
    $('.status-list').each(function () {
        for (var k in data) {
            var status = data[k];
            update_or_append_status($(this), status.username, status.status.status);
        }
    });
});
