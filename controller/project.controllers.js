const axios = require("axios");
const Joi = require("joi");
const { BASE_URL } = require("../constants.js");
const  ApiError =  require("../utils/ApiError.js");
const  ApiResponse = require("../utils/ApiResponse.js");


exports.getNftsByAddressHandle = async(req, res)=>{
  try {
    const { address} = req.query;
    console.log(`opensea api >>>>>>>>>>>>>>>>>>> ${process.env.OPENSEA_API_KEY}`);
    const schema = Joi.object({
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }


    const options = {
      method: 'GET',
      url: `https://testnets-api.opensea.io/api/v2/chain/amoy/account/${address}/nfts?limit=10`,
      headers: {accept: 'application/json', 'x-api-key': `${process.env.OPENSEA_API_KEY}}`}
    };
  
  
  
    axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return res
      .status(200)
      .json(new ApiResponse(200, response.data, `All nfts  fetched successfully`));
    })
    .catch(function (error) {
      console.error(error);
      return res
      .status(500)
      .json(new ApiResponse(500, {}, `error while getting nft data`));
      
    });

    
  } catch (error) {
    console.log(`error while getting nfts ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Internal Server Error`));
    
  }
}


exports.getNftByAddressAndIdHandle = async(req, res)=>{
  try {
    const {address, id} = req.query;
    console.log(`opensea api >>>>>>>>>>>>>>>>>>> ${process.env.OPENSEA_API_KEY}`);
    const schema = Joi.object({
      address: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
      id: Joi.number().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(401)
        .json(new ApiResponse(400, {}, error.details[0].message, "false"));
    }
   
    const options = {
      method: 'GET',
      url: `https://testnets-api.opensea.io/api/v2/chain/amoy/contract/${address}/nfts/${id}`,
      headers: {accept: 'application/json', 'x-api-key': `${process.env.OPENSEA_API_KEY}`}
    };
    

    axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return res
      .status(200)
      .json(new ApiResponse(200, response.data, `nft fetched successfully`));
    })
    .catch(function (error) {
      console.error(error);
      return res
      .status(500)
      .json(new ApiResponse(500, {}, `error while getting nft data`));
      
    });


    
  } catch (error) {
    console.log(`error while getting nfts ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Internal Server Error`));
    
  }
}









