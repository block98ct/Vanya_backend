import sequelize from "../db/index.js";
import { DataTypes } from "sequelize";

const contractAddress = sequelize.define('contractAddress', {
    // name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
    // deployedBy: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
  });

  contractAddress.sync({ force: false }); 
  
  export default contractAddress;