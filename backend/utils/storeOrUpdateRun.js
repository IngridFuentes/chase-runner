const pool = require('../db');

const storeOrUpdateRun = async (runData) => {

    console.log('Run data received:', runData);
    console.log('do i add run?')

    const client = await pool.connect();
    try {
      const {
        lat,
        lon,
        name,
        description,
        geojson,
        race_type,
        color,
        user_id
      } = runData;
  

   // Start a transaction to ensure data consistency
   await client.query('BEGIN');

   let userIdInDb;
   if (user_id) {
     // Check if user exists in the users table by 'sub' (the Auth0 'user_id')
     const userResult = await client.query('SELECT * FROM users WHERE sub = $1', [user_id]);

     if (userResult.rows.length > 0) {
       // User exists, get the ID from the users table
       userIdInDb = userResult.rows[0].sub;
     } else {
       // User does not exist, create a new user in the users table
       const insertUserResult = await client.query(
         'INSERT INTO users (sub) VALUES ($1) RETURNING sub',
         [user_id]
       );
       userIdInDb = insertUserResult.rows[0].sub;
     }
   } else {
     // For testing without authentication, use a default test user
     const testUserResult = await client.query('SELECT * FROM users WHERE sub = $1', ['test_user']);
     
     if (testUserResult.rows.length === 0) {
       const insertTestUserResult = await client.query(
         'INSERT INTO users (sub) VALUES ($1) RETURNING sub',
         ['test_user']
       );
       userIdInDb = insertTestUserResult.rows[0].sub;
     } else {
       userIdInDb = testUserResult.rows[0].sub;
     }
   }

      // Insert a new record into the runs table
      const insertRunQuery = `
        INSERT INTO runs (lat, lon, name, description, geojson, race_type, color, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const result = await client.query(insertRunQuery, [
        lat,
        lon,
        name,
        description,
        geojson,
        race_type,
        color,
        userIdInDb
      ]);
  
      console.log('Run data inserted:', result.rows[0]);
       // Commit the transaction
    await client.query('COMMIT');
    return result.rows[0];

    } catch (err) {
      // Rollback the transaction in case of an error
      await client.query('ROLLBACK');
      console.error('Error storing run data:', err);
      throw err;
    } finally {
      client.release();
    }
  };
  module.exports = storeOrUpdateRun;