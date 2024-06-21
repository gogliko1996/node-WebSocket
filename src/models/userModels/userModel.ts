const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/config.ts");

class User extends Model {
  toJSON() {
    let attributes = Object.assign({}, this.get());
    delete attributes.password;
    return attributes;
  }
}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
