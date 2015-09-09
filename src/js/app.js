var config = require('./config.js'),
    modal = require('./modal.js'),
    Quizlet = require('./quizlet.js'),
    $ = require('jquery');

Quizlet.init({
    url: config.url
});

var test = modal({ contents: '<p>A Modal Dialog</p>' });
$(document).ready(function() {
    $('#open-modal-btn').click(function() {
        test.show();
    });
});

