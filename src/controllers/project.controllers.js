import contractAddress from "../modals/contractAddress.modal.js";
import ProjectData from "../modals/projectData.modal.js";
import projectImagesData from "../modals/projectImages.modal.js";
import { BASE_URL } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export const saveContractAddressHandle = async (req, res) => {
  try {
    const { owner, address } = req.body;
    if (!address || !owner) {
      //throw new ApiError(400, "All fields are required");

      return res
        .status(201)
        .json(new ApiResponse(200, {}, "All fields are required", false));
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
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
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

    console.log(">>>>>>>>>>>.", req.body);

    // const fields = [
    //   project_type,
    //   user_id,
    //   category_id,
    //   carbon_credits,
    //   amount_worth,
    //   no_tree_planted,
    //   product_name,
    //   amount_invested_without_tax,
    //   kml_link,
    //   geo_json_link,
    //   project_desch,
    //   project_para_descp,
    //   first_image_link,
    //   first_image_text,
    //   second_image,
    //   second_image_text,
    //   third_image,
    //   third_image_text,
    //   area_in_acres,
    //   area_in_hectars,
    //   land_developer,
    //   project_header3,
    //   project_para2,
    //   project_para3,
    //   project_header4,
    //   projectstory_image,
    //   gjson_or_kml,
    //   tabs_image_link,
    //   video_link,
    //   location,
    //   address,
    //   latitude,
    //   longitude,
    //   ndvi,
    //   carbon,
    //   npar,
    //   par
    // ];

    // Check for missing fields
    // const hasEmptyFields = fields.some(
    //   (field) =>
    //     field === undefined ||
    //     field === null ||
    //     (typeof field === "string" && field.trim() === "")
    // );

    // if (hasEmptyFields) {
    //   throw new ApiError(400, "All fields are required");
    // }

    const files = req.files;
    console.log(files.projectstory_image[0].filename);
    console.log(files.first_image_link[0].filename);
    console.log(files.second_image[0].filename);
    console.log(files.third_image[0].filename);
    console.log(files.video_link[0].filename);

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
     return res.status(200)
      .json(
        new ApiResponse(200, {}, "Project data not found for this ID", "false")
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
    const result = await ProjectData.findAll();
    if (result.length <= 0) {
      return res.status(201).json(new ApiResponse(200, {}, "No data found","false"));
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
