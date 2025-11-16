const {Pool} = require("pg");
require("dotenv").config();

// const pool = new Pool({
//     database: process.env.DATABASE_NAME,
//     host: process.env.DATABASE_HOST,
//     password: process.env.DATABASE_PASSWORD,
//     user: process.env.DATABASE_USER,
//     port: process.env.DATABASE_PORT
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Necessary for connecting securely to Supabase
    }
  });
  
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to database:', res.rows);
    }
  });

module.exports = pool;