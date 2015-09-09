/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('poll_tracking', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    last_seen: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
};
