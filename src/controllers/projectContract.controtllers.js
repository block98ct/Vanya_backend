import {
  getOwner,
  getSymbol,
  getProjectData,
  getCarbonData,
  getNdviData
} from "../Web3/web3Methods/projectMethods.js";

import { ApiResponse } from "../utils/ApiResponse.js";




export const getOwnerAddressHandle = async (req, res) => {
  try {
    const {address}= req.query
    const response = await getOwner(address);
    res.status(200).json({
      status: 200,
      success: true,
      res: response,
    });
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

export const getProjectDataHandle = async (req, res) => {
  try {
    const { id, address } = req.query;
    const response = await getProjectData(id, address);
    const serializedResponse = { ...response };
    serializedResponse.createdAt = response.createdAt.toString()
    serializedResponse.updatedAt = response.updatedAt.toString()

    const resp = {
      latitude: response.latitude,
      longitude: response.longitude,
      projectAddress: response.projectAddress,
      details: response.details,
      area : response.area,
      ndvi    :  response.ndvi,
      carbon      : response.carbon,
      npar        : response.npar,
      createdAt: serializedResponse.createdAt,
      par       : response.par,
      kmlLink       : response.kmlLink,
      geoJsonLink     : response.geoJsonLink,
      projectDescription:response.projectDescription,
      firstImageLink: response.firstImageLink, 
      landDeveloper: response.landDeveloper, 
      projectStoryImage: response.projectStoryImage,
      projectType: response.projectType,
      updatedAt: serializedResponse.updatedAt,
      carbonCredits: response.carbonCredits,
      amountWorth: response.amountWorth,
      productName: response.productName


    }


    // res.status(200).json({
    //   status: 200,
    //   success: true,
    //   res: ,
    // });

    res.status(201).json(new ApiResponse(200, resp, "project data"));

  } catch (error) {
    console.log("error while getting data", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: error,
    });
  }
};


export const getCarbonAndNdviData= async(req, res)=>{
  try {
    const {time, address} = req.query;
    
  
    const carbonResp = await getCarbonData(time, address)
    const ndviResp = await getNdviData(time, address)

    res.status(201).json(new ApiResponse(200, {
      carbon: carbonResp,
      ndvi: ndviResp

    }, "carbon and ndvi data"));



  } catch (error) {
    console.log('error while getting carbon and ndvi', error)
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: error,
    });
  }

  

}





export const getSymbolHandle = async (req, res) => {
  try {
    const response = await getSymbol();
    // res.status(200).json({
    //   status: 200,
    //   success: true,
    //   res: response,
    // });

    res.status(201).json(new ApiResponse(200, response, "symbol of nft"));

  } catch (error) {
    console.log("error in getting symbol", error);
    res.status(500).json({
      status: 500,
      success: true,
      message: "Internal Server Error",
    });
  }
};


