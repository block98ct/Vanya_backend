import { Sequelize } from 'sequelize';


// Create a MySQL connection
const dbConnect = new Sequelize({ 
  dialect: 'mysql',
  host: 'localhost',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});


// Test the database connection
dbConnect
  .authenticate()
  .then(() => {
  
    console.log(`Connected to MySQL Database on PORT ${process.env.DB_PORT}`);
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err);
  });

export default dbConnect;







// import mysql from "mysql2";
//  // Create a MySQL connection
// const db = mysql.createConnection({
//       host: "localhost",
//       user: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       port: process.env.DB_PORT,
//       database: process.env.DB_NAME
// })


// // Connect to MySQL
// db.connect(err => {
//       if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//       }
//       console.log(`Connected to MySQL Database on PORT ${process.env.DB_PORT}`);
// });

// export default db;



