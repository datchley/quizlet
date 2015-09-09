var Login = require('./login.js'),
    PollAdmin = require('./poll-admin.js'),
    Poll = require('./poll.js'),
    $ = require('jquery'),
    Promise = require('bluebird'),
    _ = require('underscore');
    

// Default configuration
var defaults = {
    url: '/'
};

var Quizlet = {
    init: function(cfg) {
        var self = this;
        // configuration parameters
        this.config = $.extend({}, defaults, cfg);

        // Views for Quizlet Interface
        this.views = [Login, PollAdmin, Poll];

        // Initialize our views
        self.views.forEach(function(view) {
            view.init(self.config);
        });
    },
};

module.exports = Quizlet;

