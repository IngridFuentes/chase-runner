const getMarkers = "SELECT * FROM markers";
const addMarker = "INSERT INTO markers (lat, lon, name, country) VALUES ($1, $2, $3, $4)";

module.exports = {
    getMarkers,
    addMarker,
};