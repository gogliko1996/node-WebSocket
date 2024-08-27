const  { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/config.js");
const User = require('../../auth/models/userModel.js');



class TodoModel extends Model {
  toJSON() {
    let attributes = Object.assign({}, this.get());
    delete attributes.userId;
    return attributes;
  }
}

TodoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('todo', 'inProgres','done'),
      allowNull: false,
      defaultValue: "todo",
    },
    startStatus: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "TodoModel",
  }
);

TodoModel.belongsTo(User);

module.exports = TodoModel;
