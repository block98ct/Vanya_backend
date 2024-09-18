
const Web3 = require("web3");
const PROJECT_SMART_CONTRACT_ABI = require("../ABI/project.json"); 
const STORAGE_SMART_CONTRACT_ABI = require("../ABI/storage.json");


const STORAGE_SMART_CONTRACT_ADDRESS = process.env.STORAGE_SMART_CONTRACT_ADDRESS
// const PROJECT_SMART_CONTRACT_ADDRESS = process.env.PROJECT_SMART_CONTRACT_ADDRESS

exports.getWeb3Provider = () => {
  return new Promise( (resolve, reject) => { 
      try {
        const provider = new Web3.providers.HttpProvider(process.env.INFURA_PROVIDER_URL);
        const web3js = new Web3(provider);
        resolve({ web3js });
      } catch (error) {
        reject(error);
      }
  
  });
};


exports.getContractInstance = async (contractName, contractAddr) => {
  const { web3js } = await getWeb3Provider();
  let abi;
  let contractAddress;

  switch (contractName) {
    case 'Storage':
      abi = STORAGE_SMART_CONTRACT_ABI;
      contractAddress = STORAGE_SMART_CONTRACT_ADDRESS;
      break;
    default:
      abi = PROJECT_SMART_CONTRACT_ABI;
      contractAddress =contractAddr;
  }
  const contractInstance = new web3js.eth.Contract(abi, contractAddress);
  return contractInstance;
};




