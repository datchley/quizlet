/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('poll_answers', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pollId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'poll_id'
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    votes: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    timestamps: false
  });
};
