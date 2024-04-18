import sequelize from "../db/index.js";
import jwt from "jsonwebtoken";
import { DataTypes } from "sequelize";

const Admin = sequelize.define("Admin", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
})


Admin.prototype.generateRefreshToken= function(){
  return jwt.sign(
      {
          id: this.id
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
Admin.sync({ force: false });

export default Admin;