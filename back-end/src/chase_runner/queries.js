const getGeojson = "SELECT * FROM geojson_data";
const addMarker = "INSERT INTO markers (lat, lon, name, country, state, selectedracetype, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
const geojson_data = "INSERT INTO geojson_data (lat, lon, name, description, geojson, race_type, color, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";

module.exports = {
    getGeojson,
    addMarker,
    geojson_data,
};