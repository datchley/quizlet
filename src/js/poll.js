var template = require('../templates/poll.hbs'),
    modal = require('./modal.js'),
    $ = require('jquery'),
    Promise = require('bluebird'),
    _ = require('underscore');
    

var PollView = {
    init: function(cfg) {
        // configuration parameters
        this.config = cfg;

        this.initEvents();
    },

    initEvents: function() {
        var self = this;
        $(document).ready(function() {
            // Fetch state for this client/ip and show a poll (if any unseen)
            self.getState().then(function(results) {
                self.showPoll();
            });
        });
    },

    getState: function() {
        // Fetch our initial state from backend service
        return $.getJSON(this.config.url + '/track');
    },

    showPoll: function() {
        var self = this;
        $.getJSON(this.config.url + '/show')
            .then(function(response) {
                if (response.success) {
                    var html = template(response.data),
                        pollModal = modal({ contents: html });

                    self.$modal = pollModal.show();

                    // Submit vote
                    self.$modal.find('#vote-btn').click(function(ev) {
                        var vote = parseInt(self.$modal.find('input:checked').val(), 10);
                        console.log("vote:", vote);
                        $.ajax({
                            method: 'POST',
                            dataType: "json",
                            url: self.config.url + '/votes/' + vote
                        })
                        .then(function(result) {
                            if (result.success) {
                                console.log('>', result.message);
                            }
                        })
                        .fail(function(response) {
                            console.log("> error: ", response.responseJSON.message || response.responseText); 
                        })
                        .always(function() {
                            pollModal.hide();
                        });
                    });
                }
            });
    }
};

module.exports = PollView;

