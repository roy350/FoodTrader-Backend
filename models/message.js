'use strict';

module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    'message',
    {
      content: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {}
  );
  message.associate = function(models) {
    message.belongsTo(models.user);
    message.belongsTo(models.chat);
  };
  return message;
};
