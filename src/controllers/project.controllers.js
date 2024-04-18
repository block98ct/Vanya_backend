import ProjectData from "../modals/projectData.modal.js";
import contractAddress from "../modals/contractAddress.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addProjectDataHandle = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      projectAddress,
      details,
      area,
      ndvi,
      carbon,
      npar,
      par,
      kmlLink,
      geoJsonLink,
      projectDescription,
      firstImageLink,
      landDeveloper,
      projectStoryImage,
      projectType,
      carbonCredits,
      amountWorth,
      productName,
    } = req.body;

    if (
      latitude &&
      longitude &&
      projectAddress &&
      details &&
      area &&
      ndvi &&
      carbon &&
      npar &&
      par &&
      kmlLink &&
      geoJsonLink &&
      projectDescription &&
      firstImageLink &&
      landDeveloper &&
      projectStoryImage &&
      projectType &&
      carbonCredits &&
      amountWorth &&
      productName
    ) {
      // All fields are not empty
    } else {
      return res
        .status(201)
        .json(
          new ApiResponse(
            200,
            newProjectdata,
            "successfully added project data",
            false
          )
        );
    }

    const newProjectdata = await ProjectData.create({
      latitude,
      longitude,
      projectAddress,
      details,
      area,
      ndvi,
      carbon,
      npar,
      par,
      kmlLink,
      geoJsonLink,
      projectDescription,
      firstImageLink,
      landDeveloper,
      projectStoryImage,
      projectType,
      carbonCredits,
      amountWorth,
      productName,
    });

    if (!newProjectdata) {
      // throw new ApiError(
      //   409,
      //   "something went wrong while adding new project data "
      // );

      return res
        .status(201)
        .json(
          new ApiResponse(
            200,
            {},
            "something went wrong while adding new project data ",
            false
          )
        );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(200, newProjectdata, "successfully added project data")
      );
  } catch (error) {
    console.log(`error while adding project data  ${error}`);
    res.status(500).json({
      sucess: false,
      message: "Project data  not added ",
      error: error,
    })
  }
};




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
      .json(new ApiResponse(200, {}, "Project address already exists", false));
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
