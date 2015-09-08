var Sequelize = require('sequelize'),
    config = require('../../config').database;

// Connect to database
var db = new Sequelize(config.dbname, config.username, config.password, {
    host: 'localhost',
    dialect: 'mysql'
});

// Load Models
var models = [
  'Polls',
  'Poll_Answers',
  'Poll_Tracking'
];
models.forEach(function(model) {
  module.exports[model] = db.import(__dirname + '/' + model.toLowerCase());
});

// Setup relationships
(function(m) {
    m.Polls.hasMany(m.Poll_Answers, { as: 'answers' });
    m.Poll_Answers.belongsTo(m.Polls, { foreignKey: 'pollId' });
})(module.exports);

// Allow access to Sequelize instance
module.exports.db = db;
