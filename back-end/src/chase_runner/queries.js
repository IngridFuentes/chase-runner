const getMarkers = "SELECT * FROM markers";
const addMarker = "INSERT INTO markers (lat, lon, name, country, selectedracetype, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
// const getUsers = "SELECT * FROM users";

module.exports = {
    getMarkers,
    addMarker,
    // getUsers,
};