'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TodoModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TodoModel.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.ENUM('todo', 'inProgres','done'),
    startStatus: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TodoModel',
  });
  return TodoModel;
};