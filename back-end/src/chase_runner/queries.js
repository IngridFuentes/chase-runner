const getMarkers = "SELECT * FROM markers";
const addMarker = "INSERT INTO markers (lat, lon, name) VALUES ($1, $2, $3)";

module.exports = {
    getMarkers,
    addMarker,
};