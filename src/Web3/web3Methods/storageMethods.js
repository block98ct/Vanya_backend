import { getContractInstance } from "../Provider/web3Provider.js";



export const getOwner  = async()=>{
   const storageContract = await getContractInstance('Storage');
   const response = await storageContract
                          .methods
                          .owner()
                          .call()
   return response

   
}



export const isContractCreated = async(address)=>{
   const storageContract = await getContractInstance('Storage');
   const response = await storageContract
                          .methods
                          .isProjectContract(address)
                          .call()
   return response;

}