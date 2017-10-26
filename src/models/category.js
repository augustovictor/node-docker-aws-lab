'use strict';
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('Category', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  });
  return Category;
};