var config = require('./config.js'),
    modal = require('./modal.js'),
    polls = require('./poll.js'),
    $ = require('jquery');

polls.init({
    url: config.url
});

var test = modal({ contents: '<p>A Modal Dialog</p>' });
$(document).ready(function() {
    $('#open-modal-btn').click(function() {
        test.show();
    });
});

