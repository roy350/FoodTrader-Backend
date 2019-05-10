'use strict';

module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define(
    'publication',
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      place: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {}
  );
  publication.associate = function(models) {
    publication.belongsTo(models.user);
  };
  return publication;
};
