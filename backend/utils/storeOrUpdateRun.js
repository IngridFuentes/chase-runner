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
        user_id
      ]);
  
      console.log('Run data inserted:', result.rows[0]);
    } catch (err) {
      console.error('Error storing run data:', err);
    } finally {
      client.release();
    }
  };
  module.exports = storeOrUpdateRun;