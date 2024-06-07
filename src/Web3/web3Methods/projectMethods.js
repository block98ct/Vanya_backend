import { fromTwos } from "ethers";
import { getContractInstance } from "../Provider/web3Provider.js";
import { getWeb3Provider} from "../Provider/web3Provider.js"
import { TransactionFactory } from "@ethereumjs/tx";
import { Common } from "@ethereumjs/common";

export const getOwner = async (address) => {
  const projectContract = await getContractInstance("", address);
  const getOwnerResponse = await projectContract.methods.owner().call();
  return getOwnerResponse;
};

// export const updateProjectData = async()=>{
//     const projectContract = await getContractInstance();
// }

export const getSymbol = async () => {
  const projectContract = await getContractInstance();
  const symbolResponse = await projectContract.methods.symbol().call();
  return symbolResponse;
};

export const getCarbonData = async (time, address) => {
  const projectContract = await getContractInstance("", address);
  const response = await projectContract.methods.carbonData(time).call();
  return response;
};

export const getNdviData = async (time, address) => {
  const projectContract = await getContractInstance("", address);
  const response = await projectContract.methods.ndviData(time).call();
  return response;
};

export const tokenURI = async (tokenId) => {
  const projectContract = await getContractInstance();
  const response = await projectContract.methods.tokenURI(tokenId).call();

  return response;
};

export const getProjectData = async (id, address) => {
  const projectContract = await getContractInstance("", address);
  const response = await projectContract.methods.projectData(id).call();

  return response;
};

export const addProjectData = async (
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
  privateKey
) => {
try {
    const projectContract = await getContractInstance(
      "",
      "0xf776d126ef5a865057098cbbf2d4397f063a431e"
    );
    const response = projectContract.methods
      .addProjectData(
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
      )
      .send({from: address});
  
      return response

  

} catch (error) {
  console.log(error);
  
}
};
