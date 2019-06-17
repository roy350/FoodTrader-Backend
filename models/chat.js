'use strict';

module.exports = (sequelize, DataTypes) => {
  const chat = sequelize.define(
    'chat',
    {
      title: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      userCreatorId: DataTypes.INTEGER,
    },
    {}
  );
  chat.associate = function(models) {
    chat.belongsTo(models.user);
    chat.hasMany(models.message);
  };
  return chat;
};
