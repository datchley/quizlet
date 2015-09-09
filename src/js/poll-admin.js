var template = require('../templates/poll-admin.hbs'),
    cookie = require('../lib/js/cookie.js'),
    modal = require('./modal.js'),
    $ = require('jquery'),
    Promise = require('bluebird'),
    _ = require('underscore');
    
// Ensure cookie values are written as json
cookie.json = true;

var PollAdminView = {
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
        var self = this;
        $(document).on('quizlet:admin', function() {
            if (self.checkToken()) {
                self.showAdmin();
            }
            else {
                console.log("> error: not authenticated, no admin access");
            }
        });
    },

    showAdmin: function() {
        var self = this;

        $.getJSON(self.config.url + '/polls')
            .then(function(results) {
                var polls = [];
                if (results.success) {
                    polls = results.data.map(function(poll) {
                        var total = _.pluck(poll.answers, 'votes').reduce(function(sum, n) { return sum += n; });
                        poll.answers = poll.answers.map(function(answer) {
                            answer.percent = answer.votes ? ((answer.votes / total) * 100).toFixed(2) : 0;
                            return answer;
                        });
                        return poll;
                    });
                }
                return polls;
            })
            .then(function(polls) {
                var html = template({ 
                        'authenticated': self.checkToken(),
                        'polls': polls
                    }),
                    adminModal =  modal({ contents: html });

                self.$modal = adminModal.show();
/*
                this.$el.find('button[name="btn-login"]').on('click', function(ev) {
                    self.authenticate();
                    return false;
                });

                this.$el.find('input[name="password"]').keypress(function(ev) {
                    if (ev.which == 13) {
                        self.authenticate();
                        return false;
                    }
                });
*/
            });
    }
};

module.exports = PollAdminView;
