const getMarkers = "SELECT * FROM markers";
const addMarker = "INSERT INTO markers (lat, lon, name, country, selectedracetype, color) VALUES ($1, $2, $3, $4, $5, $6)";

module.exports = {
    getMarkers,
    addMarker,
};