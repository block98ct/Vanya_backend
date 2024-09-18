const {
  insertData,
  getDataByPagination,
  fetchCount,
  getData,
} = require("../models/common");
const {
  getSectorFromAllViews,
  getSectorFromCategory,
} = require("../models/calculator");

const {
  addProjects,
  approveProject,
  updateProjects,
  deleteProject,
  insertTransaction,
  checkTransactionID,
  getTransactionsHistoryUpdated,
  updateProjStatus,
  addProjectsMedia,
  getProjectMediaDetails,
  getThumbnailImage,
  editProjectsMedia,
  addProjectsDocs,
  editProjectsDocs,
  getProjectMediaDocumentsbyID
} = require("../models/projects");

const { getRoleID } = require("../models/users");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

exports.getProjectsByPagination = async (req, res) => {
  try {
    const pageNo = req.query.pageNo;
    const pageSize = req.query.pageSize;
    const userId = req.query.userid;

    const offset = (pageNo - 1) * pageSize;
    let totalCount = await fetchCount("projects", "");
    console.log("totalCount", totalCount);
    var projectsList = [];

    if (totalCount <= 0) {
      return res.json({
        message: "No Projects Found",
        status: 400,
        success: false,
        projectinfo: {},
      });
    }
    let result = await getDataByPagination(
      "id, project_name, project_subtitle, project_type, created_at, location, credits, remaining_credit, area_in_acres, start_date, end_date, current_phase, verification_status",
      "projects",
      `LIMIT ${pageSize} OFFSET ${offset}`    );
    // result['totalCount'] = totalCount[0]

    for (element of result) {
      tempObj = { ...element };
      const resThumbnail = await getThumbnailImage(element.id);
      if (resThumbnail.length > 0) {
        tempObj.thumbnail = resThumbnail[0].image_1URL;
      }
      projectsList.push(tempObj);
    }
    console.log(result);
    if (result.length > 0) {
      return res.json({
        message: "Projects fetched successfully",
        status: 200,
        success: true,
        projectinfo: projectsList,
      });
    } else {
      return res.json({
        message:
          "Problem fetching the Projects, please check if data is not corrupted",
        status: 400,
        success: false,
        projectinfo: {},
      });
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

exports.getProjectsById = async (req, res) => {
  try {
    const id = req.query.id;
    if (id === "") {
      return res.json({
        message: "Plesase send a valid project_id",
        status: 400,
        success: false,
        projectInfo: {},
      });
    }
    let result = await getData(
      "projects",
      `where id = ${id} and verification_status = 'Approved'`
    );

    console.log(result);
    if (result.length > 0) {
      return res.json({
        message: "Project details fetched successfully",
        status: 200,
        success: true,
        projectInfo: result[0],
      });
    } else {
      return res.json({
        message: "Project is either Unapproved or Deleted",
        status: 400,
        success: false,
        projectInfo: {},
      });
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

exports.getSectorSuggestion = async (req, res) => {
  try {
    console.log(">>>>>>", req.body.sector);
    const category = req.body.sector;

    let result = await getSectorFromAllViews(category);
    console.log("result", result);

    if (result.length > 0) {
      return res.json({
        message: "Sector",
        status: 200,
        success: true,
        userinfo: result,
      });
    } else {
      let result2 = await getSectorFromCategory(category);
      console.log("result22", result2);
      if (result2.length > 0) {
        return res.json({
          message: "Category",
          status: 200,
          success: true,
          userinfo: result2,
        });
      } else {
        return res.json({
          message: "result not found",
          status: 400,
          success: false,
          userinfo: [{ sector: "No Record Found" }],
        });
      }
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

exports.postAnswers = async (req, res) => {
  try {
    // console.log("req.body", req.body)
    const { user_id, question_id, answer } = req.body;
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
    } else {
      let questionId = question_id.toString().split(",");
      let answerId = answer.toString().split(",");
      // console.log(questionId);

      for (let index = 0; index < questionId.length; index++) {
        const obj = {};
        obj["question_id"] = questionId[index];
        obj["answer"] = answerId[index];
        obj["user_id"] = user_id;

        console.log("obj", obj);
        var resultData = await insertData("user_answers", "", obj);
      }
      if (resultData.affectedRows > 0) {
        return res.json({
          message: "Answer submitted successfully",
          status: 200,
          success: true,
          userinfo: {},
        });
      } else {
        return res.json({
          message: "failed to insert",
          status: 400,
          success: false,
          userinfo: {},
        });
      }
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

exports.getGeoJson = async (req, res) => {
  try {
    const filename = req.body.filename;
    const filePath = path.join("public/data/", filename);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.json({
          message: "File" + filename + "Not found or Error in reading file",
          status: 400,
          success: false,
        });
      }
      res.setHeader("Content-Type", "application/geojson");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + filename + '"'
      );
      res.send(data);
    });
  } catch (error) {
    console.log(error, "<==error");
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};

exports.approveProject = async (req, res) => {
  try {
    const { project_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        project_id: [Joi.number().required().empty()],
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
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;

    const roleId = await getRoleID(user_id);
    if (roleId.length > 0) {
      if (roleId[0].role_id == 3) {
        const updateResult = await approveProject(project_id);
        if (updateResult.affectedRows > 0) {
          return res.json({
            success: true,
            message: "Project Approved Succesfully",
            status: 200,
          });
        }
      } else {
        return res.json({
          success: false,
          message:
            "Only an Approver can approve Project, User is not Eligible to Approve the Project",
          status: 400,
        });
      }
    } else {
      return res.json({
        success: false,
        message: "User is not Eligible to Approve the Project",
        status: 400,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.editProject = async (req, res) => {
  try {
    const {
      project_name,
      project_subtitle,
      project_subtitle_2,
      project_short_desc,
      project_brief_detail,
      country,
      start_date,
      end_date,
      registry_details,
      project_type,
      area_in_acres,
      area_in_hectars,
      gjson_or_kml,
      location,
      new_or_existing_project,
      methodology,
      credits,
      remaining_credit,
      current_phase,
      verification_status,
      impact_metrics,
      local_benefits,
      funding_invstmnt_details,
      stakeholder_information,
      risk_assessment,
      address,
      ndvi,
      carbon,
      npar,
      par,
      projectId,
      //    projectstory_image,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_name: [Joi.string().empty().required()],
        project_subtitle: [Joi.string().empty().required()],
        project_subtitle_2: [Joi.string().empty().optional()],
        project_short_desc: [Joi.string().allow(null).allow("").optional()],
        project_brief_detail: [Joi.string().allow(null).allow("").optional()],
        country: [Joi.string().allow(null).allow("").optional()],
        start_date: [Joi.string().allow(null).allow("").optional()],
        end_date: [Joi.string().empty().required()],
        registry_details: [Joi.string().empty().optional()],
        project_type: [Joi.string().empty().optional()],
        area_in_acres: [Joi.number().empty().required()],
        area_in_hectars: [Joi.number().empty().required()],
        gjson_or_kml: [Joi.string().empty().optional()],
        location: [Joi.string().empty().required()],
        new_or_existing_project: [Joi.string().empty().required()],
        methodology: [Joi.string().empty().required()],
        credits: [Joi.number().empty().required()],
        remaining_credit: [Joi.number().empty().required()],
        current_phase: [Joi.string().empty().required()],
        verification_status: [Joi.string().empty().required()],
        impact_metrics: [Joi.string().empty().required()],
        local_benefits: [Joi.string().empty().required()],
        funding_invstmnt_details: [Joi.string().empty().required()],
        stakeholder_information: [Joi.string().empty().required()],
        risk_assessment: [Joi.string().empty().required()],
        address: [Joi.string().empty().required()],
        ndvi: [Joi.string().empty().required()],
        carbon: [Joi.string().empty().required()],
        npar: [Joi.string().empty().required()],
        par: [Joi.string().empty().required()],
        projectId: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];
    const videoLink = process.env.BASEURL_APP + "videos/" + video[0].filename;
    const firstImage =
      process.env.BASEURL_APP + "images/" + first_image[0].filename;
    const secondImage =
      process.env.BASEURL_APP + "images/" + second_image[0].filename;
    const thirdImage =
      process.env.BASEURL_APP + "images/" + third_image[0].filename;
    const projectStory =
      process.env.BASEURL_APP + "images/" + project_story[0].filename;

    var ProjectData = {
      user_id: user_id,
      project_name: project_name,
      project_subtitle: project_subtitle,
      project_subtitle_2: project_subtitle_2,
      project_short_desc: project_short_desc,
      project_brief_detail: project_brief_detail,
      country: country,
      start_date: start_date,
      end_date: end_date,
      registry_details: registry_details,
      project_type: project_type,
      area_in_acres: area_in_acres,
      area_in_hectars: area_in_hectars,
      gjson_or_kml: gjson_or_kml,
      location: location,
      new_or_existing_project: new_or_existing_project,
      methodology: methodology,
      credits: credits,
      remaining_credit: remaining_credit,
      current_phase: current_phase,
      verification_status: verification_status,
      impact_metrics: impact_metrics,
      local_benefits: local_benefits,
      funding_invstmnt_details: funding_invstmnt_details,
      stakeholder_information: stakeholder_information,
      risk_assessment: risk_assessment,
      address: address,
      ndvi: ndvi,
      carbon: carbon,
      npar: npar,
      par: par,
      projectId: projectId,
    };

    const projectDetails = await updateProjects(ProjectData);
    if (projectDetails.affectedRows > 0) {
      return res.json({
        message: "Project updated Successfully",
        status: 200,
        projectDetails: projectDetails,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        projectDetails: projectDetails,
        success: false,
      });
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

exports.deleteProjectById = async (req, res) => {
  try {
    const { id } = req.body;
    if (id === "" || id === undefined || id === null) {
      return res.json({
        message: "Plesase send a valid project_id",
        status: 400,
        success: false,
        projectInfo: {},
      });
    }
    let result = await deleteProject(id);

    console.log(result);
    if (result.affectedRows > 0) {
      return res.json({
        message: "Project deleted successfully",
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: "Failed to fetch the Project details",
        status: 400,
        success: false,
      });
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

exports.transactionHistoryUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];

    //updated code  26-07-2024 added getTransactionsHistoryUpdated model
    const transactionRes = await getTransactionsHistoryUpdated(user_id);
    if (transactionRes.length > 0) {
      return res.json({
        success: true,
        message: "Transaction History Fetched",
        transactionRes: transactionRes,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No History Found",
        status: 400,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.createBuyTransaction = async (req, res) => {
  try {
    const {
      seller_id,
      product_id,
      project_id,
      amount,
      is_buy_now,
      is_max_bid,
    } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        seller_id: Joi.number().required().empty(),
        product_id: Joi.number().required().empty(),
        project_id: Joi.number().required().empty(),
        amount: Joi.number().required().empty(),
        is_buy_now: Joi.number().required().empty(),
        is_max_bid: Joi.number().required().empty(),
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
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];
    var transactionId = "";
    var doContinue = 1;
    do {
      transactionId = randomstring.generate({
        length: 12,
        charset: "alphanumeric",
      });
      const found = await checkTransactionID(transactionId);
      if (found.length > 0) {
        doContinue = 0;
      }
    } while (doContinue);

    const transactionDetails = {
      transaction_id: transactionId,
      buyer_id: user_id,
      seller_id: seller_id,
      product_id: product_id,
      project_id: project_id,
      amount: amount,
      is_buy_now: is_buy_now,
      is_max_bid: is_max_bid,
    };
    const resultInserted = await insertTransaction(transactionDetails);
    if (resultInserted.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Bid Created",
        status: 200,
        insertId: resultInserted.insertId,
      });
    } else {
      return res.json({
        success: false,
        message: "No Data Found",
        status: 400,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.getProjectsByIdSuperAdmin = async (req, res) => {
  try {
    const id = req.query.id;
    if (id === "") {
      return res.json({
        message: "Plesase send a valid project_id",
        status: 400,
        success: false,
        projectInfo: {},
      });
    }
    let result = await getData("projects", `where id = ${id}`);

    console.log(result);
    if (result.length > 0) {
      return res.json({
        message: "Project details fetched successfully",
        status: 200,
        success: true,
        projectInfo: result[0],
      });
    } else {
      return res.json({
        message: "Project is either Unapproved or Deleted",
        status: 400,
        success: false,
        projectInfo: {},
      });
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

exports.updateProjectStatus = async (req, res) => {
  try {
    const { project_id, status } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        status: [Joi.string().empty().required()],
        project_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }

    const projectDetails = await updateProjStatus(project_id, status);
    if (projectDetails.affectedRows > 0) {
      return res.json({
        message: "Project updated Successfully",
        status: 200,
        affectedRows: projectDetails.affectedRows,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during Project status updated.",
        status: 502,
        success: false,
      });
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

exports.insertProject = async (req, res) => {
  try {
    /*const { video, image_1, image_2, image_3, image_4, image_5, image_6 } =
      req.files;*/
    const {
      project_name,
      project_subtitle,
      project_subtitle_2,
      project_short_desc,
      project_brief_detail,
      country,
      start_date,
      end_date,
      registry_details,
      project_type,
      area_in_acres,
      area_in_hectars,
      location,
      new_or_existing_project,
      methodology,
      credits,
      remaining_credit,
      current_phase,
      verification_status,
      impact_metrics,
      local_benefits,
      funding_invstmnt_details,
      stakeholder_information,
      risk_assessment,
      address,
      ndvi,
      carbon,
      npar,
      par,
      projectId,
      //    projectstory_image,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_name: [Joi.string().empty().required()],
        project_subtitle: [Joi.string().empty().required()],
        project_subtitle_2: [Joi.string().empty().optional()],
        project_short_desc: [Joi.string().allow(null).allow("").optional()],
        project_brief_detail: [Joi.string().allow(null).allow("").optional()],
        country: [Joi.string().allow(null).allow("").optional()],
        start_date: [Joi.string().allow(null).allow("").optional()],
        end_date: [Joi.string().allow(null).allow("").optional()],
        registry_details: [Joi.string().empty().optional()],
        project_type: [Joi.string().empty().optional()],
        area_in_acres: [Joi.number().empty().required()],
        area_in_hectars: [Joi.number().empty().required()],
        location: [Joi.string().empty().required()],
        new_or_existing_project: [Joi.string().empty().required()],
        methodology: [Joi.string().empty().required()],
        credits: [Joi.number().empty().required()],
        remaining_credit: [Joi.number().empty().required()],
        current_phase: [Joi.string().empty().required()],
        verification_status: [Joi.string().empty().required()],
        impact_metrics: [Joi.string().empty().required()],
        local_benefits: [Joi.string().empty().required()],
        funding_invstmnt_details: [Joi.string().empty().required()],
        stakeholder_information: [Joi.string().empty().required()],
        risk_assessment: [Joi.string().empty().required()],
        address: [Joi.string().empty().required()],
        ndvi: [Joi.string().empty().required()],
        carbon: [Joi.string().empty().required()],
        npar: [Joi.string().empty().required()],
        par: [Joi.string().empty().required()],
        projectId: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    var dateNow = new Date();
    dateNow = dateNow.toISOString().split("T")[0];
    var newStartDate  = start_date;

    if(start_date === "" || start_date === undefined || start_date === null)
    {
      newStartDate = dateNow;
    }
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];

    var ProjectData = {
      user_id: user_id,
      project_name: project_name,
      project_subtitle: project_subtitle,
      project_subtitle_2: project_subtitle_2,
      project_short_desc: project_short_desc,
      project_brief_detail: project_brief_detail,
      country: country,
      start_date: newStartDate,
      end_date: end_date,
      registry_details: registry_details,
      project_type: project_type,
      area_in_acres: area_in_acres,
      area_in_hectars: area_in_hectars,
      location: location,
      new_or_existing_project: new_or_existing_project,
      methodology: methodology,
      credits: credits,
      remaining_credit: remaining_credit,
      current_phase: current_phase,
      verification_status: verification_status,
      impact_metrics: impact_metrics,
      local_benefits: local_benefits,
      funding_invstmnt_details: funding_invstmnt_details,
      stakeholder_information: stakeholder_information,
      risk_assessment: risk_assessment,
      address: address,
      ndvi: ndvi,
      carbon: carbon,
      npar: npar,
      par: par,
      projectId: projectId,
    };

    const projectDetails = await addProjects(ProjectData);
    if (projectDetails.affectedRows > 0) {
      return res.json({
        message: "Project Created Successfully",
        status: 200,
        project_id: projectDetails.insertId,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        projectDetails: projectDetails,
        success: false,
      });
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

exports.addProjectMedias = async (req, res) => {
  try {
    const {
      video,
      image_1,
      image_2,
      image_3,
      image_4,
      image_5,
      image_6,
      geoJson,
    } = req.files;

    const {
      project_id,
      kml_link,
      image1_text,
      image2_text,
      image3_text,
      image4_text,
      image5_text,
      image6_text,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_id: [Joi.number().empty().required()],
        kml_link: [Joi.allow(null).allow("").optional()],
        image1_text: [Joi.allow(null).allow("").optional()],
        image2_text: [Joi.allow(null).allow("").optional()],
        image3_text: [Joi.allow(null).allow("").optional()],
        image4_text: [Joi.allow(null).allow("").optional()],
        image5_text: [Joi.allow(null).allow("").optional()],
        image6_text: [Joi.allow(null).allow("").optional()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    var image_1URL,
      image_2URL,
      image_3URL,
      image_4URL,
      image_5URL,
      image_6URL,
      geoJsonURL,
      video_URL= "";
    if (req.files?.image_1) {
      image_1URL = image_1[0]?.filename;
    }
    if (req.files?.image_2) {
      image_2URL = image_2[0]?.filename;
    }
    if (req.files?.image_3) {
      image_3URL = image_3[0]?.filename;
    }
    if (req.files?.image_4) {
      image_4URL = image_4[0]?.filename;
    }
    if (req.files?.image_5) {
      image_5URL = image_5[0]?.filename;
    }
    if (req.files?.image_6) {
      image_6URL = image_6[0]?.filename;
    }
    if (req.files?.video) {
      video_URL = video[0]?.filename;
    }
    if (req.files?.geoJson) {
      geoJsonURL = geoJson[0]?.filename;
    }

    var ProjectMediaData = {
      project_id: project_id,
      image_1URL: image_1URL,
      image_2URL: image_2URL,
      image_3URL: image_3URL,
      image_4URL: image_4URL,
      image_5URL: image_5URL,
      image_6URL: image_6URL,
      video_URL: video_URL,
      geo_json: geoJsonURL,
      kml_link: kml_link,
      image1_text: image1_text,
      image2_text: image2_text,
      image3_text: image3_text,
      image4_text: image4_text,
      image5_text: image5_text,
      image6_text: image6_text,
    };

    const projectDetails = await addProjectsMedia(ProjectMediaData);
    if (projectDetails.affectedRows > 0) {
      return res.json({
        message: "Project Media Uploaded Successfully",
        status: 200,
        projectDetails: projectDetails,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        projectDetails: projectDetails,
        success: false,
      });
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

exports.getProjectMedia = async (req, res) => {
  try {
    const { project_id } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    const projectDetails = await getProjectMediaDetails(project_id);
    if (projectDetails.length > 0) {
      return res.json({
        message: "Project Media Uploaded Successfully",
        status: 200,
        projectDetails: projectDetails,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        success: false,
      });
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

exports.editProjectMedias = async (req, res) => {
  try {
    const {
      video,
      image_1,
      image_2,
      image_3,
      image_4,
      image_5,
      image_6,
      geoJson,
    } = req.files;

    const {
      project_id,
      kml_link,
      image1_text,
      image2_text,
      image3_text,
      image4_text,
      image5_text,
      image6_text,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_id: [Joi.number().empty().required()],
        kml_link: [Joi.allow(null).allow("").optional()],
        image1_text: [Joi.allow(null).allow("").optional()],
        image2_text: [Joi.allow(null).allow("").optional()],
        image3_text: [Joi.allow(null).allow("").optional()],
        image4_text: [Joi.allow(null).allow("").optional()],
        image5_text: [Joi.allow(null).allow("").optional()],
        image6_text: [Joi.allow(null).allow("").optional()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    var image_1URL,
      image_2URL,
      image_3URL,
      image_4URL,
      image_5URL,
      image_6URL,
      geoJsonURL = "";
    if (req.files?.image_1) {
      image_1URL = image_1[0]?.filename;
    }
    if (req.files?.image_2) {
      image_2URL = image_2[0]?.filename;
    }
    if (req.files?.image_3) {
      image_3URL = image_3[0]?.filename;
    }
    if (req.files?.image_4) {
      image_4URL = image_4[0]?.filename;
    }
    if (req.files?.image_5) {
      image_5URL = image_5[0]?.filename;
    }
    if (req.files?.image_6) {
      image_6URL = image_6[0]?.filename;
    }
    if (req.files?.video) {
      video_URL = video[0]?.filename;
    }
    if (req.files?.geoJson) {
      geoJsonURL = geoJson[0]?.filename;
    }

    var ProjectMediaData = {
      project_id: project_id,
      image_1URL: image_1URL,
      image_2URL: image_2URL,
      image_3URL: image_3URL,
      image_4URL: image_4URL,
      image_5URL: image_5URL,
      image_6URL: image_6URL,
      video_URL: video_URL,
      geo_json: geoJsonURL,
      kml_link: kml_link,
      image1_text: image1_text,
      image2_text: image2_text,
      image3_text: image3_text,
      image4_text: image4_text,
      image5_text: image5_text,
      image6_text: image6_text,
    };

    const projectDetails = await editProjectsMedia(ProjectMediaData);
    if (projectDetails.affectedRows > 0) {
      return res.json({
        message: "Project Media Uploaded Successfully",
        status: 200,
        projectDetails: projectDetails,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        projectDetails: projectDetails,
        success: false,
      });
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

exports.addProjectDocumentation = async (req, res) => {
  try {
    const {
      doc_1,
      doc_2,
      doc_3,
      doc_4,
    } = req.files;

    const {
      project_id,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    var doc_1URL,
        doc_2URL,
        doc_3URL,
        doc_4URL= "";
    if (req.files?.doc_1) {
      doc_1URL = doc_1[0]?.filename;
    }
    if (req.files?.doc_2) {
      doc_2URL = doc_2[0]?.filename;
    }
    if (req.files?.doc_3) {
      doc_3URL = doc_3[0]?.filename;
    }
    if (req.files?.doc_4) {
      doc_4URL = doc_4[0]?.filename;
    }


    var ProjectMediaData = {
      project_id: project_id,
      doc_1: doc_1URL,
      doc_2: doc_2URL,
      doc_3: doc_3URL,
      doc_4: doc_4URL,
    };

    const projectDetails = await addProjectsDocs(ProjectMediaData);
    if (projectDetails.affectedRows > 0) {
      return res.json({
        message: "Project Docs Uploaded Successfully",
        status: 200,
        projectDetails: projectDetails,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        projectDetails: projectDetails,
        success: false,
      });
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

exports.getProjectsByPaginationUser = async (req, res) => {
  try {
    const pageNo = req.query.pageNo;
    const pageSize = req.query.pageSize;
    const userId = req.query.userid;

    const offset = (pageNo - 1) * pageSize;
    let totalCount = await fetchCount("projects", "");
    console.log("totalCount", totalCount);
    var projectsList = [];

    if (totalCount <= 0) {
      return res.json({
        message: "No Projects Found",
        status: 400,
        success: false,
        projectinfo: {},
      });
    }
    let result = await getDataByPagination(
      "id, project_name, project_subtitle, project_type, created_at, location, credits, remaining_credit, area_in_acres, start_date, end_date, current_phase, verification_status",
      "projects",
      `WHERE user_id =${userId} and verification_status = 'Approved' LIMIT ${pageSize} OFFSET ${offset}`
    );
    // result['totalCount'] = totalCount[0]

    for (element of result) {
      tempObj = { ...element };
      const resThumbnail = await getThumbnailImage(element.id);
      if (resThumbnail.length > 0) {
        tempObj.thumbnail = resThumbnail[0].image_1URL;
      }
      projectsList.push(tempObj);
    }
    console.log(result);
    if (result.length > 0) {
      return res.json({
        message: "Projects fetched successfully",
        status: 200,
        success: true,
        projectinfo: projectsList,
      });
    } else {
      return res.json({
        message:
          "Problem fetching the Projects, please check if data is not corrupted",
        status: 400,
        success: false,
        projectinfo: {},
      });
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

exports.editProjectDocumentation = async (req, res) => {
  try {
    const {
      doc_1,
      doc_2,
      doc_3,
      doc_4,
    } = req.files;

    const {
      project_id,
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    var doc_1URL,
        doc_2URL,
        doc_3URL,
        doc_4URL= "";
    if (req.files?.doc_1) {
      doc_1URL = doc_1[0]?.filename;
    }
    if (req.files?.doc_2) {
      doc_2URL = doc_2[0]?.filename;
    }
    if (req.files?.doc_3) {
      doc_3URL = doc_3[0]?.filename;
    }
    if (req.files?.doc_4) {
      doc_4URL = doc_4[0]?.filename;
    }


    var ProjectMediaData = {
      project_id: project_id,
      doc_1: doc_1URL,
      doc_2: doc_2URL,
      doc_3: doc_3URL,
      doc_4: doc_4URL,
    };

    const projectDetails = await editProjectsDocs(ProjectMediaData);
    if (projectDetails.affectedRows > 0) {
      return res.json({
        message: "Project Docs Uploaded Successfully",
        status: 200,
        projectDetails: projectDetails,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        projectDetails: projectDetails,
        success: false,
      });
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


exports.getProjectDocument = async (req, res) => {
  try {
    const { project_id } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        project_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      // Validation failed
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: message,
        error: "Validation error",
        success: false,
      });
    }
    const projectDetails = await getProjectMediaDocumentsbyID(project_id);
    if (projectDetails.length > 0) {
      return res.json({
        message: "Project Docs Fetched Successfully",
        status: 200,
        projectDetails: projectDetails,
        success: true,
      });
    } else {
      return res.json({
        message: "Some DB Error ocurred during project creation.",
        status: 502,
        success: false,
      });
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