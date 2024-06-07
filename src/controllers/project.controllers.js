import contractAddress from "../modals/contractAddress.modal.js";
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




