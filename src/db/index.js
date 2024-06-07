import { Sequelize } from 'sequelize';
//process.loadEnvFile()


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
    console.log(`Connected to MySQL Database`);
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err);
  });

export default dbConnect;











