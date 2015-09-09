var template = require('../templates/poll-admin.hbs'),
    answer_template = require('../templates/poll-answer.hbs'),
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

    initUIEvents: function() {
        var self = this,
            $answers = $('.poll-entry-list', self.$modal);
        
        $('.add-more-button', self.$modal).on('click', function() {
            $answers.append(answer_template());
        });

        $answers.on('click', '.remove', function() {
            $(this).parent('li').remove();
        });

        $('button#save-poll-btn', self.$modal).click(function(){
            var question = self.$modal.find('input.question-input').val(),
                answers = [];

            self.$modal.find('input.answer-input').each(function(index, el) {
                answers.push({ answer: $(el).val() });
            });

            var params = {
                "question": question,
                "answers": answers
            };

            $.ajax({
                method: 'POST',
                dataType: "json",
                url: self.config.url + '/polls/',
                data: params
            })
            .then(function(results) {
                if (results.success) {
                    self.adminModal.alert('success', 'New Poll created! id=' + results.data.id);
                }
                else {
                    self.adminModal.alert('error', 'Unable to create new poll: ' + results.message); 
                }
            })
            .fail(function(response) {
                self.adminModal.alert('error', response.responseJSON.message || response.responseText);
            });
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

                self.adminModal = adminModal;
                self.$modal = adminModal.show();

                self.initUIEvents();
            });
    }
};

module.exports = PollAdminView;
