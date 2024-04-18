import { getContractInstance } from "../Provider/web3Provider.js";

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




export const getCarbonData = async(time,address)=>{
  const projectContract = await getContractInstance("", address)
  const response = await projectContract
                          .methods
                          .carbonData(time)
                          .call()
  return response
}



export const getNdviData = async(time,address)=>{
  const projectContract = await getContractInstance("", address)
  const response = await projectContract
                          .methods
                          .ndviData(time)
                          .call()
  return response
}

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

// string memory latitude,
// string memory longitude,
// string memory projectAddress,
// string memory details,
// string memory area,
// string memory ndvi,
// string memory carbon,
// string memory npar,
// string memory par,
// string memory kmlLink,
// string memory geoJsonLink,
// string memory projectDescription,
// string memory firstImageLink,
// string memory landDeveloper,
// string memory projectStoryImage,
// string memory projectType,
// uint256 updatedAt,
// string memory carbonCredits,
// string memory amountWorth,
// string memory productName
