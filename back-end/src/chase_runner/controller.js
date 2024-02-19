const pool = require('../../db');
const queries = require('./queries');

const getMarkers = (req, res) => {
    pool.query(queries.getMarkers, (error, results) => {
    if(error) throw error;
    res.status(200).json(results.rows);
})
};

const addMarker = (req, res) => {
    const { lat, lon, name, country, selectedracetype, color } = req.body;
    const values = [lat, lon, name, country, selectedracetype, color] 
    pool.query(queries.addMarker, values, (error, results) => {
        if(error) throw error;
        res.status(201).send("Marker added successfully");
    })
}

module.exports = {
    getMarkers,
    addMarker,
};

