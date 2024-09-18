const db = require("../utils/database");

module.exports = {
    getMonthMeanTemperatures: async (month, location) => {
      return db.query(`select  max_temp_indegree, min_temp_indegree  from mean_temperatures where month in (${month}) and location_id = ${location}`);
    },

    getMonthMeanTranspiration: async (month, location) => {
        return db.query(`select  eet, ppt  from evapotranspiration where month in (${month}) and location_id = ${location}`);
      },
  
}