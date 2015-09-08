var template = require('../templates/poll.hbs'),
    cookie = require('../lib/js/cookie.js'),
    modal = require('./modal.js'),
    $ = require('jquery'),
    Promise = require('bluebird'),
    _ = require('underscore');
    
// Ensure cookie values are written as json
cookie.json = true;

// Default configuration
var defaults = {
    url: '/'
};

var Poll = {
    init: function(cfg) {
        // configuration parameters
        this.config = $.extend({}, defaults, cfg);

        // Does this user already have an admin token?
        this.admin_token = cookie.get('quizlet_admin_token') || false;
        if (this.admin_token) {
           console.log("Got quizlet_admin_token: ", this.admin_token); 
        }

        // Fetch our initial state from our endpoint
        this.getState().then(function(success) {
            if (success) {
                this.initEvents(); 
                this.showPoll();
            }
        }.bind(this));
    },

    getState: function() {
        // Fetch our initial state from backend service
        return $.getJSON(this.config.url + '/track')
            .then(function(response) {
                if (response.success) {
                    this.state = response.data;
                    console.log("> got initial state: ", this.state);
                    return true;
                }
                else {
                    console.log("> error fetching state: ", response.message);
                    return false;
                }
            });
    },

    initEvents: function() {
        // tracking hot key sequences (keydown can't detect uppercase/lowercase reports all uppercase char codes)
        var sequence = 'QUIZLET'.split('').reduce(function(acc, char) {
                acc.push(char.charCodeAt(0));
                return acc;
            }, []).concat([38]),    // up-arrow at end
            captured = [];

        // Listen for hotkey to trigger admin loggin
        $(document).keydown(function(ev) {
            captured.push(ev.keyCode);
            if (new RegExp("^"+captured.toString()).test(sequence)) {
                // Matches sequence so far, is it a full match?
                if (captured.toString() == sequence.toString()) {
                    console.log("> Admin Login Request!");
                    $(document).trigger('quizlet:adminRequest');
                }
            }
            else {
                // clear the sequence, wait and try again
                captured = [];
            }
        });
    },

    showPoll: function() {
        $.getJSON(this.config.url + '/show')
            .then(function(response) {
                if (response.success) {
                    var html = template(response.data),
                        poll_modal = modal({ contents: html });

                    poll_modal.show();
                }
            });
    }
};

module.exports = Poll;

