const fromTwos = require("ethers");
const getContractInstance = require("../Provider/web3Provider.js");
const  getWeb3Provider = require("../Provider/web3Provider.js");
const TransactionFactory = require("@ethereumjs/tx");
const Common =  require("@ethereumjs/common");

exports.getOwner = async (address) => {
  const projectContract = await getContractInstance("", address);
  const getOwnerResponse = await projectContract.methods.owner().call();
  return getOwnerResponse;
};

// exports.updateProjectData = async()=>{
//     const projectContract = await getContractInstance();
// }

exports.getSymbol = async () => {
  const projectContract = await getContractInstance();
  const symbolResponse = await projectContract.methods.symbol().call();
  return symbolResponse;
};

exports.getCarbonData = async (time, address) => {
  const projectContract = await getContractInstance("", address);
  const response = await projectContract.methods.carbonData(time).call();
  return response;
};

exports.getNdviData = async (time, address) => {
  const projectContract = await getContractInstance("", address);
  const response = await projectContract.methods.ndviData(time).call();
  return response;
};

exports.tokenURI = async (tokenId) => {
  const projectContract = await getContractInstance();
  const response = await projectContract.methods.tokenURI(tokenId).call();

  return response;
};

exports.getProjectData = async (id, address) => {
  const projectContract = await getContractInstance("", address);
  const response = await projectContract.methods.projectData(id).call();

  return response;
};

exports.addProjectData = async (
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
