import sequelize from "../db/index.js"
import { DataTypes } from "sequelize";



// const ProjectData = sequelize.define('ProjectData',  {


//     latitude: {
//         type: DataTypes.STRING(255),
//         allowNull: true
//     },
//     longitude: {
//         type: DataTypes.STRING(255),
//         allowNull: true  
//     },
//     projectAddress: {
//         type: DataTypes.STRING(255),
//         allowNull: true 
//     },
//     area: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     ndvi: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     carbon: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     npar: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     par: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     kmlLink: {
//         type: DataTypes.STRING(255),
//         allowNull: true
//     },
//     geoJsonLink: {
//         type: DataTypes.STRING(255),
//         allowNull: true
//     },
//     projectType: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     carbonCredits: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     amountWorth: {
//         type: DataTypes.STRING(50),
//         allowNull: true
//     },
//     address: {
//         type: DataTypes.STRING(255),
//         allowNull: true
//     }
// });

// Sync the model with the database

const ProjectData = sequelize.define('projects', {
  
    project_type: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0',
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    carbon_credits: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    amount_worth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    no_tree_planted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    product_name: {
      type: DataTypes.STRING(255),
      defaultValue: '0',
    },
    amount_invested_without_tax: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    kml_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    geo_json_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    project_desch: {
      type: DataTypes.STRING(255),
      defaultValue: '0',
    },
    project_para_descp: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    first_image_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0',
    },
    first_image_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    second_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0',

    },
    second_image_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    third_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0',

    },
    third_image_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    area_in_acres: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    area_in_hectars: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    land_developer: {
      type: DataTypes.STRING(255),
      defaultValue: '0',
    },
    project_header3: {
      type: DataTypes.STRING(255),
      defaultValue: '0',
    },
    project_para2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    project_para3: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    project_header4: {
      type: DataTypes.STRING(255),
      defaultValue: '0',
    },
    projectstory_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0',

    },
    gjson_or_kml: {
      type: DataTypes.STRING(1),
      defaultValue: 'K',
      comment: 'Value can be K or G',
    },
    tabs_image_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0',

    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },


    ndvi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    carbon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    npar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    par: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '0',
    }
  }, {
    timestamps: false, // Set to true if your table has `createdAt` and `updatedAt` fields
  }
);
  


ProjectData.sync({ force: false }); // Set force to true to drop and recreate the table

// Export the ProjectData model
export default ProjectData;