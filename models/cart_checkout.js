const db = require('../utils/database');

module.exports = {

    insertCartDetails: async (data) => {
        return db.query("insert into cart_items set ?", [data]);
      },


      
}