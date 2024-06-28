import {
  getOwner,
  getSymbol,
  getProjectData,
  getCarbonData,
  getNdviData,
  addProjectData,
} from "../Web3/web3Methods/projectMethods.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ethers } from "ethers";

import PROJECT_SMART_CONTRACT_ABI from "../Web3/ABI/project.json" assert { type: "json" };
import STORAGE_SMART_CONTRACT_ABI from "../Web3/ABI/storage.json" assert { type: "json" };



export const getOwnerAddressHandle = async (req, res) => {
  try {
    const { address } = req.query;
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
    serializedResponse.createdAt = response.createdAt.toString();
    serializedResponse.updatedAt = response.updatedAt.toString();

    const resp = {
      latitude: response.latitude,
      longitude: response.longitude,
      projectAddress: response.projectAddress,
      details: response.details,
      area: response.area,
      ndvi: response.ndvi,
      carbon: response.carbon,
      npar: response.npar,
      createdAt: serializedResponse.createdAt,
      par: response.par,
      kmlLink: response.kmlLink,
      geoJsonLink: response.geoJsonLink,
      projectDescription: response.projectDescription,
      firstImageLink: response.firstImageLink,
      landDeveloper: response.landDeveloper,
      projectStoryImage: response.projectStoryImage,
      projectType: response.projectType,
      updatedAt: serializedResponse.updatedAt,
      carbonCredits: response.carbonCredits,
      amountWorth: response.amountWorth,
      productName: response.productName,
    };

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

export const getCarbonAndNdviData = async (req, res) => {
  try {
    const { time, address } = req.query;

    const carbonResp = await getCarbonData(time, address);
    const ndviResp = await getNdviData(time, address);

    res.status(201).json(
      new ApiResponse(
        200,
        {
          carbon: carbonResp,
          ndvi: ndviResp,
        },
        "carbon and ndvi data"
      )
    );
  } catch (error) {
    console.log("error while getting carbon and ndvi", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: error,
    });
  }
};

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

const contractInstance = async (privateKey, address, abi) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.JsonRpcProvider(
      process.env.INFURA_PROVIDER_URL
    );
    const connectedWallet = wallet.connect(provider);
    const contract = new ethers.Contract(
      address,
      abi,
      connectedWallet
    );

    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const addProjectDataHandle = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      projectAddress,
      area,
      ndvi,
      carbon,
      npar,
      par,
      kmlLink,
      geoJsonLink,
      projectType,
      carbonCredits,
      amountWorth,
      address,
      privateKey,
    } = req.body;

    console.log(req.body);

    // if (
    //   [
    //     latitude,
    //     longitude,
    //     projectAddress,
    //     area,
    //     ndvi,
    //     carbon,
    //     npar,
    //     par,
    //     kmlLink,
    //     geoJsonLink,
    //     projectType,
    //     carbonCredits,
    //     amountWorth,
    //     address,
    //     privateKey,
    //   ].some((field) => field?.trim() === "")
    // ) {
    //   throw new ApiError(400, "All fields are required");
    // }

    const contract = await contractInstance(privateKey, address, PROJECT_SMART_CONTRACT_ABI);
    const response = await contract.addProjectData(
      latitude,
      longitude,
      projectAddress,
      area,
      ndvi,
      carbon,
      npar,
      par,
      kmlLink,
      geoJsonLink,
      projectType,
      carbonCredits,
      amountWorth
    );

    const tx = await response.wait()

    let logs = tx.logs;
    let events = logs.map((log) => {
      return contract.interface.parseLog(log);
    });

    let projectCreatedEvents = events.filter((event) => {
      return event.name === "ProjectDataAdded";
    });

    let projectCreatedEvent = projectCreatedEvents[0];
    let projectId = projectCreatedEvent.args.projectId;
    console.log("projectId ------------>", Number(projectId));

    return res
      .status(201)
      .json(new ApiResponse(200, {},`Project data has been added successfully`));
  } catch (error) {
    console.log(`error while adding project data  ${error}`);
    res.status(500).json({
      sucess: false,
      message: `Project data  not added`,
      error: error,
    });
  }
};


export const updateProjectDataHandle = async(req, res)=>{
  try {

    const {
      projectId,
      latitude,
      longitude,
      projectAddress,
      area,
      ndvi,
      carbon,
      npar,
      par,
      kmlLink,
      geoJsonLink,
      projectType,
      carbonCredits,
      amountWorth,
      address,
      privateKey,
    } = req.body;

    console.log(req.body);

    if (
      [
        projectId,
        latitude,
        longitude,
        projectAddress,
        area,
        ndvi,
        carbon,
        npar,
        par,
        kmlLink,
        geoJsonLink,
        projectType,
        carbonCredits,
        amountWorth,
        address,
        privateKey,
      ].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    
    const contract = await contractInstance(privateKey,address, PROJECT_SMART_CONTRACT_ABI);

    const response = await contract.updateProjectData(
      projectId,
      latitude,
      longitude,
      projectAddress,
      area,
      ndvi,
      carbon,
      npar,
      par,
      kmlLink,
      geoJsonLink,
      projectType,
      carbonCredits,
      amountWorth
    );

    const tx = await response.wait()
    console.log(tx);
    return res
    .status(201)
    .json(new ApiResponse(200, {}, "Project data has been successfully updated"));

  } catch (error) {
    console.log(`error while updating project data  ${error}`);
    res.status(500).json({
      sucess: false,
      message: "data is not updated ",
      error: error,
    });
    
  }
}


export const issueCertificate = async(req, res)=>{
  try {
    const {  projectId, uri} = req.body
    console.log(req.body);
    
    const contractAddress ='0xF55acdf7768Bb90BE7d29068CEEd5B0578F0424E'
    const address = '0x4F02C3102A9D2e1cC0cC97c7fE2429B9B6F5965D'
    const privateKey = `fe2d1b12f7cb4f6aaf2953b8d1528bf9ee0329eb1d89f9b380cc595c05475a9d`

    const contract = await contractInstance(privateKey, contractAddress, STORAGE_SMART_CONTRACT_ABI)
    const response = await contract.issueCertificate(address, projectId, uri)
    await response.wait()

    return res
    .status(201)
    .json(new ApiResponse(200, {},`NFT created and transfer successfully`));

    
  } catch (error) {
    console.log(`error while generating nft  ${error}`);
    res.status(500).json({
      sucess: false,
      message: "error while generating nft",
      error: error,
    });
    
  }
}



