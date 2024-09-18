const db = require('../utils/database');

module.exports={
    getFootPrints:(async (data) => {

        return db.query(`SELECT * FROM vanya_recipes WHERE LOWER(ingredients) REGEXP \'.*${data}.*\' `);
    }),
    getFootRecipe:(async (data) => {

        return db.query(`SELECT * FROM vanya_recipes WHERE LOWER(recipe) REGEXP \'.*${data}.*\'`);
    }),
    getCFromFirstView:(async (data)=>{
        return db.query(`SELECT * FROM first_view WHERE category REGEXP \'.*${data}.*\' GROUP BY activity_id`)
    }),
    // LIKE '%${data}%'
    getCFromSecondtView:(async (data)=>{
        return db.query(`SELECT * FROM second_view WHERE LOWER(category) REGEXP \'.*${data}.*\' GROUP BY activity_id`)
    }),
    getCFromThirdView:(async (data)=>{
        return db.query(`SELECT * FROM third_view WHERE LOWER(category) REGEXP \'.*${data}.*\' GROUP BY activity_id`)
    }),
    getCFromFourthView:(async (data)=>{
        return db.query(`SELECT * FROM fourth_view WHERE LOWER(category) REGEXP \'.*${data}.*\' GROUP BY activity_id`)
    }),
    getCFromFifthView:(async (data)=>{
        return db.query(`SELECT * FROM fifth_view WHERE LOWER(category) REGEXP \'.*${data}.*\' GROUP BY activity_id`)
    }),
    getCFromSixthView:(async (data)=>{
        return db.query(`SELECT * FROM sixth_view WHERE LOWER(category) REGEXP \'.*${data}.*\' GROUP BY activity_id`)
    }),
    getSectorFromAllViews:(async (data)=>{
        return db.query(`SELECT sector FROM first_view WHERE LOWER(sector) REGEXP '^${data}'
        UNION SELECT sector FROM second_view WHERE LOWER(sector) REGEXP '^${data}'
        UNION SELECT sector FROM third_view WHERE LOWER(sector) REGEXP '^${data}'
        UNION SELECT sector FROM fourth_view WHERE LOWER(sector) REGEXP '^${data}'
        UNION SELECT sector FROM fifth_view WHERE LOWER(sector) REGEXP '^${data}'
        UNION SELECT sector FROM sixth_view WHERE LOWER(sector) REGEXP '^${data}'
        UNION SELECT sector FROM vanya_recipes WHERE LOWER(sector) REGEXP '^${data}'
        `)
    }),
    getSectorFromCategory:(async (data)=>{
        return db.query(`
        SELECT sector,category FROM first_view WHERE LOWER(category) REGEXP '^${data}'
        UNION SELECT sector,category FROM second_view WHERE LOWER(category) REGEXP '^${data}'
        UNION SELECT sector,category FROM third_view WHERE LOWER(category) REGEXP '^${data}'
        UNION SELECT sector,category FROM fourth_view WHERE LOWER(category) REGEXP '^${data}'
        UNION SELECT sector,category FROM fifth_view WHERE LOWER(category) REGEXP '^${data}'
        UNION SELECT sector,category FROM sixth_view WHERE LOWER(category) REGEXP '^${data}'
        UNION SELECT sector,recipe FROM vanya_recipes WHERE LOWER(recipe) REGEXP '^${data}'
        `)
    }),
}
