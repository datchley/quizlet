var template = require('../templates/login.hbs'),
    cookie = require('../lib/js/cookie.js'),
    modal = require('./modal.js'),
    $ = require('jquery'),
    Promise = require('bluebird'),
    _ = require('underscore');
    

var LoginView = {
    init: function(cfg) {
        // configuration parameters
        this.config = cfg;

        this.checkToken();

        this.initEvents();
    },

    checkToken: function() {
        // Does this user already have an admin token?
        this.admin_token = cookie.get('quizlet_admin_token') || false;
        if (this.admin_token) {
           console.log("Got quizlet_admin_token: ", this.admin_token); 
        }
        return this.admin_token;
    },

    initEvents: function() {
        // tracking hot key sequences (keydown can't detect uppercase/lowercase reports all uppercase char codes)
        var sequence = 'QUIZLET'.split('').reduce(function(acc, char) {
                acc.push(char.charCodeAt(0));
                return acc;
            }, []).concat([38]),    // up-arrow at end
            captured = [],
            self = this;

        // Listen for hotkey to trigger admin loggin
        $(document).keydown(function(ev) {
            captured.push(ev.keyCode);
            if (new RegExp("^"+captured.toString()).test(sequence)) {
                // Matches sequence so far, is it a full match?
                if (captured.toString() == sequence.toString()) {
                    console.log("> Admin Login Request!");
                    if (!self.checkToken()) {
                        self.showLogin();
                    }
                    else {
                        $(document).trigger('quizlet:admin');
                    }
                }
            }
            else {
                // clear the sequence, wait and try again
                captured = [];
            }
        });
    },

    showLogin: function() {
        var html = template({ authenticated: this.checkToken() }),
            loginModal =  modal({ contents: html }),
            self = this;

        this.loginModal = loginModal;
        this.$modal = loginModal.show();

        this.$modal.find('button[name="btn-login"]').on('click', function(ev) {
            self.authenticate();
            return false;
        });

        this.$modal.find('input[name="password"]').keypress(function(ev) {
            if (ev.which == 13) {
                self.authenticate();
                return false;
            }
        });
    },

    authenticate: function() {
        var params = {
                username: 'admin',
                password: this.$modal.find('input[name="password"]').val()
            },
            self = this;

        return $.getJSON(this.config.url + '/authenticate', params)
        .then(function(results) {
            // Set Admin token cookie on successful login
            if (results.success) {
                console.log("results: ", results);
                cookie.set('quizlet_admin_token', results.token);
                $(document).trigger('quizlet:admin');
            }
            else {
                self.loginModal.alert("<b>Error</b>: " + results.message);
            }
        })
        .fail(function(response) {
            var json = response.responseJSON;
            console.log("> error:", json.message);
            self.loginModal.alert('error', "<b>Error</b>: " + json.message || response.responseText);
        });
    }

};

module.exports = LoginView;
