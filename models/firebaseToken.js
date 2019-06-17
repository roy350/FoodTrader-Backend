'use strict';

module.exports = (sequelize, DataTypes) => {
  const firebaseToken = sequelize.define(
    'firebaseToken',
    {
      token: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {}
  );
  firebaseToken.associate = function(models) {
    firebaseToken.belongsTo(models.user);
  };
  return firebaseToken;
};
