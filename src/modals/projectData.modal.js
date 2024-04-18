import sequelize from "../db/index.js"
import { DataTypes } from "sequelize";



const ProjectData = sequelize.define('ProjectData', {

    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    projectAddress: {
        type: DataTypes.STRING(255),
        allowNull: false 
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    area: DataTypes.STRING(50),
    ndvi: DataTypes.STRING(50),
    carbon: DataTypes.STRING(50),
    npar: DataTypes.STRING(50),
    par: DataTypes.STRING(50),
    kmlLink: DataTypes.STRING(255),
    geoJsonLink: DataTypes.STRING(255),
    projectDescription: DataTypes.TEXT,
    firstImageLink: DataTypes.STRING(255),
    landDeveloper: DataTypes.STRING(255),
    projectStoryImage: DataTypes.STRING(255),
    projectType: DataTypes.STRING(50),
    carbonCredits: DataTypes.STRING(50),
    amountWorth: DataTypes.STRING(50),
    productName: DataTypes.STRING(255)
});

// Sync the model with the database
ProjectData.sync({ force: false }); // Set force to true to drop and recreate the table

// Export the ProjectData model
export default ProjectData;