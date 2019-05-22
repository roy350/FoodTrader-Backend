'use strict';

const bcrypt = require('bcrypt');

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, 10);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      isOrganization: DataTypes.BOOLEAN,
      isActive: DataTypes.BOOLEAN,
    },
    {}
  );

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  user.associate = function(models) {
    user.hasMany(models.publication);
    user.hasMany(models.review);
  };
  return user;
};
