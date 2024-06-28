import sequelize from "../db/index.js"
import { DataTypes } from "sequelize";




const projectImagesData = sequelize.define("projectImages", {

    projectAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      imgUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
  
},
{
    timestamps: true
}
)



projectImagesData.sync({ force: false }); // Set force to true to drop and recreate the table

// Export the ProjectData model
export default projectImagesData;


