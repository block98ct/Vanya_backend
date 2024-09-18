const Joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const hash = require("random-hash");
const {insertCartDetails} = require("../models/cart_checkout")

exports.addToCart = async (req, res) => {
  try {
    const { project_name, quantity, answer } = req.body;
    console.log(req.body);
    const schema = Joi.alternatives(
      Joi.object({
        answer: Joi.array().required(),
        user_id: Joi.string().required(),
        question_id: Joi.array().required(),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    }
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;
    const orderId = hash.generateHash({ length: 14 });

    cartItems = {
        session_id : jwtToken,
        order_id : orderId,
        user_id : user_id
    }
   const insertResult = await insertCartDetails(cartItems);
   if(insertResult.affectedRows > 0)
   {
         
   }

  } catch (error) {
    console.log(error, "<==error");
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};
