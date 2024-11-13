const pool = require('../../db');
const queries = require('./queries');
const util = require('util');

// const getGeojson = (req, res) => {
//   if (!req.user) {
//     return res.status(401).json({ error: 'Unauthorized: No user found.' });
//   }
//   const userId = req.user.sub;
//   console.log(userId, 'user?')
//   pool.query(queries.getGeojson, [userId], (error, results) => {
//     if (error) {
//       // Log only relevant error information
//       console.error('Error fetching GeoJSON data:', {
//         message: error.message,
//         code: error.code,
//         stack: error.stack
//       });
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.json({ message: 'CORS is working!' });
//   res.status(200).json(results.rows);
// })
// };


const getGeojson = (req, res) => {
  console.log('here good')
}

// const getGeojson = async (req, res) => {
//   const userId = result.rows[0].id;
  
//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     const results = await pool.query('SELECT * FROM geojson_data WHERE user_id = $1;', [userId]);
//     res.status(200).json(results.rows);
//   } catch (error) {
//     console.error("Error fetching GeoJSON data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


const addMarker = (req, res) => {
    const { lat, lon, name, country, state, selectedracetype, user_id } = req.body;
    const values = [lat, lon, name, country, state, selectedracetype, user_id ] 
    pool.query(queries.addMarker, values, (error, results) => {
        if(error) throw error;
        res.status(201).send("Marker added successfully");
    })
}

const geojson_data = async (req, res) => {
  const { lat, lon, name, geojson, race_type, color, description, user_id } = req.body;

  try {

      const result = await pool.query(
        queries.geojson_data,
        [lat, lon, name, description, geojson, race_type, color, user_id]
      );
      res.status(201).json({
        message: 'Data inserted successfully!',
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({
        message: 'Error inserting data',
        error: error.message,
      });
    }
};
  

module.exports = {
    getGeojson,
    addMarker,
    geojson_data
};

