import {
  getOwner,
  isContractCreated,
} from "../Web3/web3Methods/storageMethods.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export const getOwnerHandle = async (req, res) => {
  try {
    const response = await getOwner();

    res.status(201).json(new ApiResponse(200, response, "owner of contract"));
  } catch (error) {
    console.log("error in getting owner", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: error,
    });
  }
};

export const isContractCreatedHandle = async (req, res) => {
  try {
    const { address } = req.query;
    const response = await isContractCreated(address);
    if(!response){
      return res.status(201).json(new ApiResponse(200, response, "contract is not created"));

    }
    res.status(201).json(new ApiResponse(200, response, "contract is created"));


  } catch (error) {
    console.log("error in getting owner", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: error,
    });
  }
};
