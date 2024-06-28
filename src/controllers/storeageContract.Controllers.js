import {
  getOwner,
  isContractCreated,
} from "../Web3/web3Methods/storageMethods.js";

import fs from "fs"
import pinataSDK from "@pinata/sdk"
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
console.log(`Loading .env file from: ${envPath}`);
dotenv.config({ path: envPath });


// Log the environment variables to debug
console.log("PINATA_API_KEY:", process.env.PINATA_API_KEY);
console.log("PINATA_SECRET_KEY:", process.env.PINATA_SECRET_KEY);

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY)
import { ApiResponse } from "../utils/ApiResponse.js";





export const getOwnerHandle = async (req, res) => {
  try {
    const response = await getOwner();

    res.status(201).json(new ApiResponse(200, response, "owner of contract"));
  } catch (error) {
    console.log("error in getting owner", error);
    res.status(501).json(new ApiResponse(500, error, "Internal Server Error"));

   
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



export const uploadMetaDataHandle = async (req, res)=>{
 try {
   const { data } = req.body;
   console.log(req.body);
  //  let imgResult;

  //  try {
  //   const stream = fs.createReadStream('../public/images/treeInHand.jpg');
  //    imgResult = await pinata.pinFileToIPFS(stream, {
  //     wrapWithDirectory: false,
  //     pinataMetadata: {
  //       name: 'treeInHand.jpg',
  //     },
  //   })
  //  // https://ipfs.io/ipfs/QmdUYhyvAGqVuM1DwQxsAFH7b9hVe2qnUL4CnmgkjZ4PiS
  //   console.log('Image uploaded successfully!');
  //   console.log('IPFS CID:', imgResult.IpfsHash);
  // } catch (error) {
  //   console.error('Error uploading image:', error.message);
  // }
 
   const jsonData = {
     "name": "Certificate",
     "description": "yearly report of data",
     "attributes": [
       {
         "trait_type": "Latitude",
         "value": data.latitude
       },
       {
         "trait_type": "Longitude",
         "value": data.longitude
       },
       {
         "trait_type": "Project Address",
         "value": data.projectAddress
       },
   
       {
         "trait_type": "Area",
         "value": data.area
       },
       {
         "trait_type": "NDVI",
         "value": data.ndvi
       },
       {
         "trait_type": "Carbon",
         "value": data.carbon
       },
       {
         "trait_type": "NPAR",
         "value": data.npar
       },
       {
         "trait_type": "PAR",
         "value": data.par
       },
 
       {
         "trait_type": "Project Type",
         "value": data.projectType
       },
       {
         "trait_type": "Carbon Credits",
         "value": data.carbonCredits
       },
       {
         "trait_type": "Amount Worth",
         "value": data.amountWorth
       }
     ],
     "image":`https://gateway.pinata.cloud/ipfs/QmVaKCA9xUxxCqfn7HxiBmv4i7yyigzEeGiNAkH2qHm1Ho`
   };
   // Upload the metadata to Pinata
   const result = await pinata.pinJSONToIPFS(jsonData);
   console.log('IPFS Hash (CID):', result.IpfsHash);
  
   const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
   res.status(201).json(new ApiResponse(200, url, "uploaded metadata successfully"));
  } catch (error) {
     console.error('Error uploading metadata to Pinata:', error);
     res.status(501).json(new ApiResponse(500, error, "Internal Server Error"));
 }
} 


export const uploadImageHandle = async(req,res)=>{
   try {
       const stream = fs.createReadStream('../public/images/treeInHand.jpg');
       const imgResult = await pinata.pinFileToIPFS(stream, {
         wrapWithDirectory: false,
         pinataMetadata: {
           name: 'treeInHand.jpg',
         },
       })
       // https://ipfs.io/ipfs/QmdUYhyvAGqVuM1DwQxsAFH7b9hVe2qnUL4CnmgkjZ4PiS
       console.log('Image uploaded successfully!');
       console.log('IPFS CID:', imgResult.IpfsHash);

       res.status(201).json(new ApiResponse(200, imgResult.IpfsHash, "uploaded image successfully"));

   } catch (error) {
      console.log(error);
      res.status(501).json(new ApiResponse(500, {}, "Internal Server Error"));

   }
   
}

