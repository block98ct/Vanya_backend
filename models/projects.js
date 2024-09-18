const db = require("../utils/database");
module.exports = {
  addUser: async (user) => {
    return db.query("insert into users set ?", [user]);
  },

  addProjects: async (data) => {
    return db.query("INSERT INTO projects SET ?", [data]);
  },

  addProjectsMedia: async (data) => {
    return db.query("INSERT INTO projects_media SET ?", [data]);
  },

  addProjectsDocs: async (data) => {
    return db.query("INSERT INTO projects_documents SET ?", [data]);
  },


  editProjectsDocs: async (data) => {
    return db.query(
      "UPDATE projects_documents SET doc_1=?, doc_2 =?, doc_3=?, doc_4=?, updated_at=CURRENT_TIMESTAMP  WHERE project_id = ?",
      [
        data.doc_1,
        data.doc_2,
        data.doc_3,
        data.doc_4,
        data.project_id
      ]
    );
  },

  editProjectsMedia: async (data) => {
    return db.query(
      "UPDATE projects_media SET video_URL=?, image_1URL =?, image_2URL=?, image_3URL=?, image_4URL=?, image_5URL=?, image_6URL=?, geo_json = ?, kml_link = ?, image1_text =?, image2_text= ?, image3_text=?, image4_text=?, image5_text=?, image6_text =? WHERE project_id = ?",
      [
        data.video_URL,
        data.image_1URL,
        data.image_2URL,
        data.image_3URL,
        data.image_4URL,
        data.image_5URL,
        data.image_6URL,
        data.geo_json,
        data.kml_link,
        data.image1_text,
        data.image2_text, 
        data.image3_text,
        data.image4_text, 
        data.image5_text, 
        data.image6_text,
        data.project_id,
      ]
    );
  },

  addProjectFiles: async (data) => {
    return db.query(
      "INSERT INTO   `projects` (user_id, first_image_link, second_image, third_image, projectstory_image, video_link) VALUES (?,?,?,?,?,?)",
      [
        data.user_id,
        data.first_image_link,
        data.second_image,
        data.third_image,
        data.projectstory_image,
        data.video_link,
      ]
    );
  },

  approveProject: async (project_id) => {
    return db.query(
      "Update projects set verification_status = 'Approved' where id= ?",
      [project_id]
    );
  },

  updateProjects: async (data) => {
    return db.query(
      "Update projects set project_name = ? ,project_subtitle=?,project_subtitle_2=?, project_short_desc=? ,project_brief_detail=? , project_desch=?, \
      country=? ,start_date=? ,end_date=?, second_image=?, registry_details=? ,project_type=?, \
      area_in_acres=? ,area_in_hectars=?, area_in_hectars=?, gjson_or_kml=?, location=?, new_or_existing_project=?, \
      methodology=?, credits=?,  remaining_credit=?,  current_phase=?,  verification_status=?, impact_metrics=?, local_benefits=? \
      funding_invstmnt_details=?,stakeholder_information=?,	risk_assessment=?,  address = ?, ndvi = ?, carbon=? \
	    npar =?, par=?, projectId=? where id= ?",
      [
        data.project_name,
        data.project_subtitle,
        data.project_subtitle_2,
        data.project_short_desc,
        data.project_brief_detail,
        data.country,
        data.start_date,
        data.end_date,
        data.registry_details,
        data.project_type,
        data.area_in_acres,
        data.area_in_hectars,
        data.gjson_or_kml,
        data.location,
        data.new_or_existing_project,
        data.methodology,
        data.credits,
        data.remaining_credit,
        data.current_phase,
        data.verification_status,
        data.impact_metrics,
        data.local_benefits,
        data.funding_invstmnt_details,
        data.stakeholder_information,
        data.risk_assessment,
        data.address,
        data.ndvi,
        data.carbon,
        data.npar,
        data.par,
        data.projectId,
        data.project_id,
      ]
    );
  },

  deleteProject: async (id) => {
    return db.query("DELETE FROM projects WHERE id=?", [id]);
  },

  getTransactionsHistoryUpdated: async (user_id) => {
    return db.query(`select * from  buy_sell_transactions 
           where buyer_id = '${user_id}'`);
  },

  checkTransactionID: async (transactionID) => {
    return db.query(
      "select count(*) from buy_sell_transactions where transaction_id = ?",
      [transactionID]
    );
  },

  insertTransaction: async (data) => {
    return db.query("insert into buy_sell_transactions set ?", [data]);
  },

  updateProjStatus: async (project_id, status) => {
    return db.query("update projects set verification_status =? where id=?", [
      status,
      project_id,
    ]);
  },

  getProjectMediaDetails: async (project_id) => {
    return db.query("select * from projects_media where project_id =?", [
      project_id,
    ]);
  },

  getThumbnailImage: async (project_id) => {
    return db.query(
      "select image_1URL from projects_media where project_id =?",
      [project_id]
    );
  },

  getProjectMediaDocumentsbyID: async (project_id) => {
    return db.query("select * from projects_documents where project_id =?", [
      project_id,
    ]);
  },

  updateProjectIdBlock: async(projectId, id)=>{
    const result=  await db.query(`update projects set projectId=${projectId} where id=${id}`)
    console.log("result >>>>>>>>>>>>>>>>>>>>>>>>>", result)
    return result
   }
};
