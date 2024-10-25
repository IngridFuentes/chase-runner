const pool = require('../../db');
const queries = require('./queries');

// const getMarkers = (req, res) => {
//     pool.query(queries.getMarkers, (error, results) => {
//     if(error) throw error;
//     res.status(200).json(results.rows);
// })
// };

const getGeojson = (req, res) => {
    pool.query(queries.getGeojson, (error, results) => {
    if(error) throw error;
    res.status(200).json(results.rows);
})
};

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
        // SQL query to insert the data into the PostgreSQL database
        const result = await pool.query(
          queries.geojson_data,
          [lat, lon, name, description, geojson, race_type, color, user_id]
        );

        console.log(result, 'rsult')
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

