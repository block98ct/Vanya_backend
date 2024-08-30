import contractAddress from "../modals/contractAddress.modal.js";
import axios from "axios";
import Joi from "joi";
import ProjectData from "../modals/projectData.modal.js";
import projectImagesData from "../modals/projectImages.modal.js";
import { BASE_URL } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const saveContractAddressHandle = async (req, res) => {
  try {
    const { owner, address } = req.body;

    const schema = Joi.object({
      owner: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const [newAddress, created] = await contractAddress.findOrCreate({
      where: { address: address },
      defaults: { owner: owner, address: address },
    });

    if (!created) {
      // throw new ApiError(409, "Project address already exists");
      return res
        .status(201)
        .json(
          new ApiResponse(200, {}, "Project address already exists", false)
        );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, newAddress, "Address added successfully"));
  } catch (error) {
    console.log("error in saving address", error);
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
  }
};

export const getContractOwnerHandle = async (req, res) => {
  try {
    const response = await contractAddress.findAll();

    return res
      .status(201)
      .json(new ApiResponse(200, response, "Address added successfully"));
  } catch (error) {
    console.log("error in getting contract owner", error);
    res.status(501).json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const addProjectDataHandle = async (req, res) => {   
  try {
    const {
      project_type,
      user_id,
      category_id,
      carbon_credits,
      amount_worth,
      no_tree_planted,
      product_name,
      amount_invested_without_tax,
      kml_link,
      geo_json_link,
      project_desch,
      project_para_descp,
      first_image_text,
      second_image_text,
      third_image_text,
      area_in_acres,
      area_in_hectars,
      land_developer,
      project_header3,
      project_para2,
      project_para3,
      project_header4,
      gjson_or_kml,
      tabs_image_link,
      location,
      address,
      latitude,
      longitude,
      ndvi,
      carbon,
      npar,
      par,
    } = req.body;

    // console.log(">>>>>>>>>>>.", req.body);

    const schema = Joi.object({
      project_type: Joi.string().required(),
      user_id: Joi.number().integer().required(),
      category_id: Joi.number().integer().required(),
      carbon_credits: Joi.number().required(),
      amount_worth: Joi.number().required(),
      no_tree_planted: Joi.string().required(),
      product_name: Joi.string().required(),
      amount_invested_without_tax: Joi.string().required(),
      kml_link: Joi.string().uri().required(),
      geo_json_link: Joi.string().uri().required(),
      project_desch: Joi.string().required(),
      project_para_descp: Joi.string().required(),
      first_image_text: Joi.string().required(),
      second_image_text: Joi.string().required(),
      third_image_text: Joi.string().required(),
      area_in_acres: Joi.string().required(),
      area_in_hectars: Joi.string().required(),
      land_developer: Joi.string().required(),
      project_header3: Joi.string().required(),
      project_para2: Joi.string().required(),
      project_para3: Joi.string().required(),
      project_header4: Joi.string().required(),
      gjson_or_kml: Joi.string().required(),
      tabs_image_link: Joi.string().uri().required(),
      location: Joi.string().required(),
      address: Joi.string().required(),
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
      ndvi: Joi.string().required(),
      carbon: Joi.string().required(),
      npar: Joi.string().required(),
      par: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const files = req.files;
    // console.log(files.projectstory_image[0].filename);
    // console.log(files.first_image_link[0].filename);
    // console.log(files.second_image[0].filename);
    // console.log(files.third_image[0].filename);
    // console.log(files.video_link[0].filename);

    const projectImage = files.projectstory_image[0].filename;
    const firstImage = files.first_image_link[0].filename;
    const secondImage = files.second_image[0].filename;
    const thirdImage = files.third_image[0].filename;
    const video = files.video_link[0].filename;

    // Create the project data
    const newProject = await ProjectData.create({
      project_type,
      user_id,
      category_id,
      carbon_credits,
      amount_worth,
      no_tree_planted,
      product_name,
      amount_invested_without_tax,
      kml_link,
      geo_json_link,
      project_desch,
      project_para_descp,
      first_image_link: firstImage,
      first_image_text,
      second_image: secondImage,
      second_image_text,
      third_image: thirdImage,
      third_image_text,
      area_in_acres,
      area_in_hectars,
      land_developer,
      project_header3,
      project_para2,
      project_para3,
      project_header4,
      projectstory_image: projectImage,
      gjson_or_kml,
      tabs_image_link,
      video_link: video,
      location,
      address,
      latitude,
      longitude,
      ndvi,
      carbon,
      npar,
      par,
    });


    if (!newProject) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, "Error creating new project", "false"));
    }

    // Send a successful response
    return res
      .status(201)
      .json(new ApiResponse(200, newProject, "Project added successfully"));
  } catch (error) {
    console.log("Error while adding project:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const getProjectDataByIdHandle = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      throw new ApiError(400, "Project ID is required");
    }

    const projectData = await ProjectData.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!projectData) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            "Project data not found for this ID",
            "false"
          )
        );
    }

    projectData.video_link = `${BASE_URL}/temp/${projectData.video_link}`;
    projectData.third_image = `${BASE_URL}/temp/${projectData.third_image}`;
    projectData.second_image = `${BASE_URL}/temp/${projectData.second_image}`;
    projectData.projectstory_image = `${BASE_URL}/temp/${projectData.projectstory_image}`;
    projectData.first_image_link = `${BASE_URL}/temp/${projectData.first_image_link}`;

    return res
      .status(200)
      .json(
        new ApiResponse(200, projectData, "Project data retrieved successfully")
      );
  } catch (error) {
    console.log("Error while retrieving project data:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const getAllProjectsHandle = async (req, res) => {
  try {
    const { status} = req.query;
    const schema = Joi.object({
      status: Joi.number().required()
    })

    const {error} =  schema.validate(req.query)

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }


    const result = await ProjectData.findAll({
      where: {
        status: status,
      },
    });
    // const result = await ProjectData.findAll();

    if (result.length <= 0) {
      return res
        .status(201)
        .json(new ApiResponse(200, {}, "No data found", "false"));
    }

    result.map((item) => {
      item.video_link = `${BASE_URL}/temp/${item.video_link}`;
      item.third_image = `${BASE_URL}/temp/${item.third_image}`;
      item.second_image = `${BASE_URL}/temp/${item.second_image}`;
      item.projectstory_image = `${BASE_URL}/temp/${item.projectstory_image}`;
      item.first_image_link = `${BASE_URL}/temp/${item.first_image_link}`;
    });

    return res
      .status(201)
      .json(new ApiResponse(200, result, "All projects data"));
  } catch (error) {
    console.log("Error while getting all projects data:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const projectImagesHandle = async (req, res) => {
  try {
    const { projectAddress, imgUrl } = req.body;
    if (!projectAddress || !imgUrl) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "All fields are required"));
    }

    const resp = await projectImagesData.create({ projectAddress, imgUrl });

    if (!resp) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error while adding data"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          resp,
          "Project address with ipfs url added successfully"
        )
      );
  } catch (error) {
    console.log("Error while adding images url:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const approveProject = async (req, res) => {
  try {
    const { id, status } = req.body;

    const schema = Joi.object({
      id: Joi.number().integer().required(),
      status: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const [affectedRows] = await ProjectData.update(
      { status },
      { where: { id } }
    );

    // console.log("affected rows------>", affectedRows);
    if (affectedRows == 0) {
      return res
        .status(401)
        .json(
          new ApiResponse(400, {}, `causing some error while updating database`)
        );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, {}, `Project status updated successfully`));
  } catch (error) {
    console.log("Error while approving project:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const allApprovedProjects = async (req, res) => {
  try {
    const projects = await ProjectData.findAll({
      where: {
        status: 1,
      },
    });

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, {}, "No projects found with approved status")
        );
    }

    projects.map((item) => {
      item.video_link = `${BASE_URL}/temp/${item.video_link}`;
      item.third_image = `${BASE_URL}/temp/${item.third_image}`;
      item.second_image = `${BASE_URL}/temp/${item.second_image}`;
      item.projectstory_image = `${BASE_URL}/temp/${item.projectstory_image}`;
      item.first_image_link = `${BASE_URL}/temp/${item.first_image_link}`;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, projects, "Projects fetched successfully"));
  } catch (error) {
    console.log(`error while getting all approved projects ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Internal Server Error`));
  }
};


export const getNftsByAddressHandle = async(req, res)=>{
  try {
    const { address} = req.query;
    console.log(`opensea api >>>>>>>>>>>>>>>>>>> ${process.env.OPENSEA_API_KEY}`);
    const schema = Joi.object({
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }


    const options = {
      method: 'GET',
      url: `https://testnets-api.opensea.io/api/v2/chain/amoy/account/${address}/nfts?limit=10`,
      headers: {accept: 'application/json', 'x-api-key': `${process.env.OPENSEA_API_KEY}}`}
    };
  
  
  
    axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return res
      .status(200)
      .json(new ApiResponse(200, response.data, `All nfts  fetched successfully`));
    })
    .catch(function (error) {
      console.error(error);
      return res
      .status(500)
      .json(new ApiResponse(500, {}, `error while getting nft data`));
      
    });

    
  } catch (error) {
    console.log(`error while getting nfts ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Internal Server Error`));
    
  }
}


export const getNftByAddressAndIdHandle = async(req, res)=>{
  try {
    const {address, id} = req.query;
    console.log(`opensea api >>>>>>>>>>>>>>>>>>> ${process.env.OPENSEA_API_KEY}`);
    const schema = Joi.object({
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
      id: Joi.number().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }
   
    const options = {
      method: 'GET',
      url: `https://testnets-api.opensea.io/api/v2/chain/amoy/contract/${address}/nfts/${id}`,
      headers: {accept: 'application/json', 'x-api-key': `${process.env.OPENSEA_API_KEY}`}
    };
    

    axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return res
      .status(200)
      .json(new ApiResponse(200, response.data, `nft fetched successfully`));
    })
    .catch(function (error) {
      console.error(error);
      return res
      .status(500)
      .json(new ApiResponse(500, {}, `error while getting nft data`));
      
    });


    
  } catch (error) {
    console.log(`error while getting nfts ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Internal Server Error`));
    
  }
}









