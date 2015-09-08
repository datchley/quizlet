var config = require('./config'),
    util = require('util'),
    model = require('./sql/models'),
    express = require('express'),
    jwtoken = require('jsonwebtoken'),
    Promise = require('bluebird');

//
// This is the Quizlet Middleware for Express
// Poll API Routes
//
var router = express.Router();


// Simple authentication middleware
function auth(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwtoken.verify(token, config.admin_key, function(err, decoded) {
            if (err) {
                return res.json({
                    message: "Failed to authenticate token"
                });
            }
            req.decoded = decoded;
            next();
        });
    }
    else {
        return req.status(403).json({
            'success': false,
            'message': 'No authentication token provided'
        });
    }
}

function getOrCreateClientTracker(ip) {
    return model.Poll_Tracking.count({ client: ip })
    .then(function(count) {
        console.log("> count = ", count);
        if (count) {
            return model.Poll_Tracking.findOne({ client: ip });
        }
        else {
            return model.Poll_Tracking.create({
                client: ip,
                seen: '[]'  // empty JSON array
            });
        }
    });
}

function updateClientTracker(ip, pollId) {
    pollId = parseInt(pollId, 10);

    return getOrCreateClientTracker(ip)
    .then(function(tracker) {
        var seen = JSON.parse(tracker.seen);
        if (seen.indexOf(pollId) == -1) {
            seen.push(pollId); 
            tracker.seen = JSON.stringify(seen);
        }
        return tracker.save();
    });
}

// Tracking via request IP and returning given state for client
router.route('/track')
    .get(function(req, res) {
        var ip = req.connection.remoteAddress;
        model.Poll_Tracking.findOne({
            where: { client: ip }
        })
        .then(function(result) {
            res.json({
                success: true,
                data: result
            });
        })
        .catch(function(error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        });
    });

router.route('/show')
    .get(function(req, res) {
        var ip = req.connection.remoteAddress;
        getOrCreateClientTracker(ip)
        .then(function(tracker) {
            console.log("> got tracker: ", tracker);    
            var seen = JSON.parse(tracker.seen),
                max = seen.length ? Math.max.apply(null, seen) : 0; 

            model.Polls.findOne({
                where: { id: { $gt: max } },
                include: [ { model: model.Poll_Answers, as: 'answers' } ],
                order: [ [ 'id', 'ASC' ] ]
            })
            .then(function(poll) {
                return updateClientTracker(ip, poll.id)
                    .then(function() {
                        return poll;
                    });
            })
            .then(function(poll) {
                res.json({
                    success: true,
                    data: poll
                });
            });
        });
    });

// Authentication for 'admin'
router.route('/authenticate')
    .post(function(req, res) {
        if (req.body.username == 'admin' && req.body.password == config.admin_password) {
            var token = jwtoken.sign('admin', config.admin_key, {
                    expiresInMinutes: 1440  // 24 hours
            });
            res.json({
                'success': true,
                'token': token
            });
        }
        else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });

router.route('/polls')
    .get(function(req, res) {
        // get all polls
        model.Polls.findAll({ 
            include: [ { model: model.Poll_Answers, as: 'answers' } ] 
        }).then(function(results) {
            res.status(200).json({
                success: true,
                data: results
            });
        });
    })
    .post(auth, function(req, res) {
        console.log("Received Poll: ", req.body);
        model.Polls
            .create(req.body, { fields: [ 'question' ] })
            .then(function(poll) {
                return poll.reload();
            })
            .then(function(poll) {
                if (req.body['answers']) {
                    req.body.answers.forEach(function(answer) {
                        answer.pollId = poll.id;
                    });
                
                    return model.Poll_Answers.bulkCreate(req.body.answers, { returning: true })
                        .then(function() {
                            return model.Polls.findOne({ 
                                where: { id: poll.id },
                                include: [ { model: model.Poll_Answers, as: 'answers' } ]
                            });
                        })
                        .catch(function(error) {
                            res.status(500).json({
                                success: false,
                                message: error.message
                            });
                        });
                }
                return model.Polls.findOne({
                    where: { id: poll.id },
                    include: [ { model: model.Poll_Answers, as: 'answers' } ]
                });
            })
            .then(function(poll) {
                res.status(201).json({
                    success: true,
                    data: poll
                });
            })
            .catch(function(error) {
                res.status(500).json({
                    success: false,
                    message: error
                });
            });
    });

router.route('/polls/:id')
    .get(function(req, res) {

        var ip = req.connection.remoteAddress,
            pollId = req.params.id;

        Promise.join(
            // Find the poll matching this :id
            model.Polls.findAll({ 
                where: { id: pollId },
                include: [ { model: model.Poll_Answers, as: 'answers' } ] 
            }),

            // Update tracker for this poll id + client
            updateClientTracker(ip, pollId),

            function(polls /*, tracker */) {
                return polls;
            }
        )
        .then(function(results) {
            res.status(200).json({
                success: true,
                data: results
            });
        })
        .catch(function(error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        });
    });

// Simple action API route to handle voting
// Takes an array of one or more answer ids to up the vote count on
router.route('/votes')
    .post(auth, function(req, res) {
       var answers = req.body;
       if (!util.isArray(answers)) {
        answers = [answers];
       }

       model.db.query('UPDATE poll_answers SET votes = votes + 1 WHERE id IN (' + answers.join(',') + ')')
       .spread(function(results) {
            console.log("Updated counts: ", results);             
            res.json({
                success: true,
                message: "Updated vote count for " + results.changedRows + "/" + results.affectedRows + " answers: " + req.body.join(',')
            });
       })
       .catch(function(error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
       });
    });

// Export our middleware
module.exports = router;
