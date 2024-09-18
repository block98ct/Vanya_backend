const Joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const math = require("mathjs");

const {
  getMonthMeanTemperatures,
  getMonthMeanTranspiration,
} = require("../models/cc_calculate");

exports.calculateCarbonCredits = async (req, res) => {
  try {
    const { location_id, start_date, end_date, project_id, par, ndvi } =
      req.body;

    const schema = Joi.alternatives(
      Joi.object({
        location_id: Joi.number().required().empty(),
        start_date: Joi.string().required().empty(),
        end_date: Joi.string().required().empty(),
        project_id: Joi.number().required().empty(),
        par: Joi.number().required().empty(),
        ndvi: Joi.number().required().empty(),
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 200,
        success: true,
      });
    }
    const startDate = new Date(start_date); // current date
    const endDate = new Date(end_date); // 11 months ago
    const months = [];

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      months.push(currentDate.toLocaleString("default", { month: "long" }));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    var mon3Letters = months.map((str) => str.substr(0, 3));
    mon3Letters = mon3Letters.map((str) => "'" + str + "'");
    const monthsText = mon3Letters.join(",");
    var tOptSum = 0;
    var TOpt = 0;
    var tMonSum = 0;
    var TMon = 0;
    var eet = 0;
    var eetSum = 0;
    var ppt = 0;
    var pptSum = 0;
    // var ndvi = 0.1;
    //  var par= 94.5;
    if (mon3Letters.length > 0) {
      const result = await getMonthMeanTemperatures(monthsText, location_id);
      const transResult = await getMonthMeanTranspiration(
        monthsText,
        location_id
      );
      if (result.length > 0 && transResult.length > 0) {
        result.map((elem) => {
          tOptSum += Number(elem.max_temp_indegree);
          tMonSum += Number(elem.min_temp_indegree);
        });
        TOpt = tOptSum / result.length;
        TMon = tMonSum / result.length;

        transResult.map((elem) => {
          eetSum += Number(elem.eet);
          pptSum += Number(elem.ppt);
        });

        eet = eetSum / transResult.length;
        ppt = pptSum / transResult.length;
        // Calculate the components of the equation
        const ifirstTerm = math.multiply(
          1.185,
          math.add(
            1,
            math.exp(
              math.subtract(math.subtract(math.multiply(0.2, TOpt), 10), TMon)
            )
          )
        );
        const firstTerm = math.subtract(ifirstTerm, 1);
        const secondTerm = math.multiply(
          -1,
          math.add(
            1,
            math.exp(
              math.subtract(math.subtract(math.multiply(-0.3, TOpt), 10), TMon)
            )
          )
        );

        // Calculate the final result by combining both terms
        var T2 = math.add(firstTerm, secondTerm);
        T2 = math.abs(T2);

        var T1 = 0.8 + 0.02 * TOpt - 0.0005 * TOpt;
        T1 = math.abs(T1);

        W = 0.5 + ppt / eet;
        ///epsillom = (2.5g/MJ)
        var LUE = 2.5 * T1 * T2 * W;

        var AGB = ndvi * par * LUE;

        var TB = 1.2 * AGB;

        var TDW = TB * 0.725;

        var TC = TDW * 0.5;

        var CO2weight = TC * 3.67;

        var area = 1;

        var carbonCreditsGenerated = CO2weight * area;
        carbonCreditsGenerated = Math.round(carbonCreditsGenerated);

        return res.json({
          message: "The Carbon Credits are calculcated",
          carbonCreditsGenerated: carbonCreditsGenerated,
          status: 200,
          success: true,
        });
      }
    } else {
      return res.json({
        message: "No Data Found",
        result: result,
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
      error: error,
      status: 400,
      success: false,
    });
  }
};

exports.buyCarbonCredits = async (req, res) => {
  try {
    const {
      seller_id,
      buyer_id,
      versions,
      project_id,
      start_date,
      end_date,
      expiry_date,
      amount_invested,
      carbon_credit_bought,
      cycle,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        seller_id: Joi.number().required().empty(),
        buyer_id: Joi.number().required().empty(),
        versions: Joi.number().required().empty(),
        project_id: Joi.number().required().empty(),
        start_date: Joi.string().required().empty(),
        end_date: Joi.string().required().empty(),
        expiry_date: Joi.string().required().empty(),
        amount_invested: Joi.number().required().empty(),
        carbon_credit_bought: Joi.number().required().empty(),
        cycle: Joi.string().required().empty(),
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 200,
        success: true,
      });
    }
    const data = {
      seller_id: seller_id,
      buyer_id: buyer_id,
      versions: versions,
      project_id: project_id,
      start_date: start_date,
      end_date: end_date,
      expiry_date: expiry_date,
      amount_invested: amount_invested,
      carbon_credit_bought: carbon_credit_bought,
      cycle: cycle,
    };

    const insertRes = await insertBuySellCredits(data);
    if(insertRes.affectedRows  > 0)
    {
      return res.json({
        message: "Buy Sell transaction created.",
        rows: insertRes.affectedRows ,
        status: 200,
        success: true,
      });
    }
    else {
      return res.json({
        message: "Database problem occured",
        status: 400,
        success: false,
      });
    }

  } catch (error) {
    return res.json({
      message: "Internal Server Error",
      error: error,
      status: 500,
      success: false,
    });
  }
};
