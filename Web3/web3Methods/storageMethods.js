const getContractInstance = require("../Provider/web3Provider.js");


exports.getOwner  = async()=>{
   const storageContract = await getContractInstance('Storage');
   const response = await storageContract
                          .methods
                          .owner()
                          .call()
   return response

   
}



exports.isContractCreated = async(address)=>{
   const storageContract = await getContractInstance('Storage');
   const response = await storageContract
                          .methods
                          .isProjectContract(address)
                          .call()
   return response;

}