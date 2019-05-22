'use strict';

module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define(
    'review',
    {
      content: DataTypes.STRING,
      value: DataTypes.INTEGER,
      userCreatorId: DataTypes.INTEGER,
    },
    {}
  );
  review.associate = function(models) {
    review.belongsTo(models.user);
  };
  return review;
};
