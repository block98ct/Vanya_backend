import ProjectData from "../modals/projectData.modal.js";
import nftId from "../modals/nftId.modal.js"

import {
  getOwner,
  getSymbol,
  getProjectData,
  getCarbonData,
  getNdviData,
} from "../Web3/web3Methods/projectMethods.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ethers } from "ethers";
import Joi from "joi";

import PROJECT_SMART_CONTRACT_ABI from "../Web3/ABI/project.json" assert { type: "json" };
import STORAGE_SMART_CONTRACT_ABI from "../Web3/ABI/storage.json" assert { type: "json" };

const contractAddress = process.env.STORAGE_SMART_CONTRACT_ADDRESS;
const address = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

export const contractInstance = async (privateKey, address, abi) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.JsonRpcProvider(
      process.env.INFURA_PROVIDER_URL
    );
    const connectedWallet = wallet.connect(provider);
    const contract = new ethers.Contract(address, abi, connectedWallet);

    return contract;
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
  }
};

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
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
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
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
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
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
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
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
  }
};

export const addProjectDataHandle = async (req, res) => {
  try {
    const {
      id,
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

    const schema = Joi.object({
      id: Joi.number().integer().required(), // Validating id as a required integer
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
      projectAddress: Joi.string().required(),
      area: Joi.string().required(),
      ndvi: Joi.string().required(),
      carbon: Joi.string().required(),
      npar: Joi.string().required(),
      par: Joi.string().required(),
      kmlLink: Joi.string().uri().required(),
      geoJsonLink: Joi.string().uri().required(),
      projectType: Joi.string().required(),
      carbonCredits: Joi.string().required(),
      amountWorth: Joi.string().required(),
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
      privateKey: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }
    const contract = await contractInstance(
      privateKey,
      address,
      PROJECT_SMART_CONTRACT_ABI
    );

    // console.log("contract >>>>>>>>>>>>>>>>>>>>>>>>>", contract);

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

    // console.log("response >>>>>>>>>>>>>>>>>>>>>>>>>", response);

    const tx = await response.wait();
    // console.log("tx>>>>>>>>>>>>>>>>", tx);

    let logs = tx.logs;
    // console.log("logs >>>>>>>>>>>>>>>>", logs);

    // let events = logs.map((log) => {
    //   return contract.interface.parseLog(log);
    // });

    // console.log("events >>>>>>>>>>>>>>>>", events);

    let events = logs.map((log) => {
      if (log) {
        return contract.interface.parseLog(log);
      }
      return null;
    }).filter(event => event !== null);  // Filter out null values
      



    let projectCreatedEvents = events.filter((event) => {
      return event.name === "ProjectDataAdded";
    });

    // console.log("projectCreatedEvents >>>>>>>>>>>>>>>>", projectCreatedEvents);

    let projectCreatedEvent = projectCreatedEvents[0];
    // console.log("projectCreatedEvent >>>>>>>>>>>>>>>>", projectCreatedEvent);

    let projectId = Number(projectCreatedEvent.args.projectId);
    console.log("projectId >>>>>>>>>>>>>>>>", projectId);

    // console.log("projectId ------------>", Number(projectId));
    const [affectedRows] = await ProjectData.update(
      { projectId },
      { where: { id } }
    );

    if (affectedRows == 0) {
      return res
        .status(401)
        .json(
          new ApiResponse(400, {}, "causing some erroe while updating database")
        );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, {}, `project added successfully`));
  } catch (error) {
    console.log(`error while adding project data  ${error}`);
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
  }
};

export const updateProjectDataHandle = async (req, res) => {
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
      version,
      cycle,
      address,
      privateKey,
    } = req.body;

    console.log(req.body);

    const schema = Joi.object({
      projectId: Joi.number().integer().required(),
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
      projectAddress: Joi.string().required(),
      area: Joi.string().required(),
      ndvi: Joi.string().required(),
      carbon: Joi.string().required(),
      npar: Joi.string().required(),
      par: Joi.string().required(),
      kmlLink: Joi.string().uri().required(),
      geoJsonLink: Joi.string().uri().required(),
      projectType: Joi.string().required(),
      carbonCredits: Joi.string().required(),
      amountWorth: Joi.string().required(),
      version: Joi.number().required(),
      cycle: Joi.string().required(),
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
      privateKey: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const contract = await contractInstance(
      privateKey,
      address,
      PROJECT_SMART_CONTRACT_ABI
    );

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
      amountWorth,
      cycle,
      version
    );

    const tx = await response.wait();
    console.log(tx);
    return res
      .status(201)
      .json(
        new ApiResponse(200, {}, "Project data has been successfully updated")
      );
  } catch (error) {
    console.log(`error while updating project data  ${error}`);
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
  }
};

export const issueCertificate = async (req, res) => {
  try {
    const { projectId, uri } = req.body;
    console.log(req.body);
    console.log("contractAddress >>>>>>>>>>>>>>>>>>>>>>>>", contractAddress);

    const schema = Joi.object({
      projectId: Joi.string().required(),
      uri: Joi.string().uri().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const contract = await contractInstance(
      privateKey,
      contractAddress,
      STORAGE_SMART_CONTRACT_ABI
    );
    const response = await contract.issueCertificate(address, projectId, uri);
    await response.wait();

    // await ProjectData.update(
    //   { nftId },
    //   { where: { id } }
    // );

    return res
      .status(201)
      .json(new ApiResponse(200, {}, `NFT created and transfer successfully`));
  } catch (error) {
    console.log(`error while generating nft  ${error}`);
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
  }
};

export const transferNftHandle = async (req, res) => {
  try {
    const { to, id } = req.body;
    const schema = Joi.object({
      to: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(), // Validating Ethereum address
      id: Joi.number().integer().required(), // Validating id as a required integer
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }
    if (to == address) {
      return res
        .status(401)
        .json(
          new ApiResponse(
            400,
            {},
            `You cannot transfer nft to your self`,
            "false"
          )
        );
    }

    const contract = await contractInstance(
      privateKey,
      contractAddress,
      STORAGE_SMART_CONTRACT_ABI
    );
    const response = await contract.safeTransferFrom(address, to, id);
    await response.wait();

    await ProjectData.update(
      {
        nftId: 1,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res
      .status(201)
      .json(new ApiResponse(200, {}, `NFT transferred successfully`));
  } catch (error) {
    console.log(`error while transferring nft >>>>>>> ${error}`);
    return res
      .status(501)
      .json(new ApiResponse(500, error, `Internal server error`));
  }
};

export const getAllTimestampsOfProjectHandle = async (req, res) => {
  try {
    const { address, projectId } = req.body;

    const schema = Joi.object({
      projectId: Joi.number().integer().required(), // Validating id as a required integer
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(), // Validating Ethereum address
      // timestamps: Joi.date().timestamp("javascript").required(), // Validating timestamp as a required date
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const contract = await contractInstance(
      privateKey,
      address,
      PROJECT_SMART_CONTRACT_ABI
    );

    const timestamps = await contract.getProjectTimestamps(projectId);
    // console.log("resonse >>>>>>>>>>>>>>>>>>",timestamps)

    const response = await timestamps.map((item) => {
      console.log(item.toString());
      return item.toString();
    });

    // console.log("response >>>>>>>>>>>>>>>>>>", response)

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          response,
          `All timestamps of project id ${projectId}`
        )
      );
  } catch (error) {
    console.log(error);
    res.status(501).json(new ApiResponse(500, {}, `Internal Server Error`));
  }
};

export const getProjectByTimestampHandle = async (req, res) => {
  try {
    const { address, id, timestamp } = req.body;

    const schema = Joi.object({
      id: Joi.number().integer().required(), // Validating id as a required integer
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(), // Validating Ethereum address
      timestamp: Joi.date().timestamp("javascript").required(), // Validating timestamp as a required date
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const contract = await contractInstance(
      privateKey,
      address,
      PROJECT_SMART_CONTRACT_ABI
    );
    const data = await contract.getProjectData(id, timestamp);
    console.log("resonse >>>>>>>>>>>>>>>>>>", data);

    let response = await data.map((item) => {
      console.log(item);
      return item.toString();
    });

    response = {
      latitude: data[0].toString(),
      longitude: data[1].toString(),
      projectAddress: data[2],
      area: data[3].toString(),
      ndvi: data[4].toString(),
      carbon: data[5].toString(),
      npar: data[6].toString(),
      par: data[7].toString(),
      kmlLink: data[8],
      geoJsonLink: data[9],
      projectType: data[10],
      carbonCredits: data[11].toString(),
      amountWorth: data[12].toString(),
      createdAt: data[13].toString(),
      updatedAt: data[14].toString(),
    };

    return res
      .status(200)
      .json(new ApiResponse(200, response, "project data by timestamp"));
  } catch (error) {
    console.log("error while getting project by timestamp", error);
    res.status(501).json(new ApiResponse(500, {}, `Internal Server Error`));
  }
};

export const projectCreatedTimeHandle = async(req, res)=>{
  try {
    const { address, projectId} = req.body

    const schema = Joi.object({
      projectId: Joi.number().integer().required(),
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(), // Validating Ethereum address
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }

    const contract = await contractInstance(
      privateKey,
      address,
      PROJECT_SMART_CONTRACT_ABI
    );

    const timestamps = await contract.projectCreatedAt(projectId);
    console.log("timestamps >>>>>>>>>>>>>>>>>>>>>>>>>",timestamps);


    if (!timestamps) {
      return res
      .status(401)
      .json(new ApiResponse(400, {}, `project does not exists`));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, timestamps.toString(), "project created timestamp"));
    
  } catch (error) {
    console.log(`error while getting project created time ${error}`);
    res.status(501).json(new ApiResponse(500, {}, `Internal Server Error`));

    
  }
}



