import sequelize from "../db/index.js";
import jwt from "jsonwebtoken";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
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

});

User.beforeCreate(async function (user) {
  const hashedPassword = bcrypt.hashSync(user.password, 8);
  user.password = hashedPassword;
  user.confirmPassword = hashedPassword;

});


User.beforeUpdate(async function (user) {
  if (user.changed('password')) { 
    const hashedPassword = bcrypt.hashSync(user.password, 8);
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword; 
  }
});



User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



User.prototype.generateAccessToken = async function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};








User.sync({ force: false });

export default User;
