const pool = require('../db');

// Function to fetch runs by user ID
const getRunsForUser = async (userId) => {
  console.log(userId, 'user id get runs for user')
  try {
    const client = await pool.connect();
    // Query to get all runs for the specific user
    const query = 'SELECT * FROM runs WHERE user_id = $1';
    const result = await client.query(query, [userId]);

    client.release();
    console.log(result.rows, 'Fetched runs data');
    return result.rows; // Return the runs found
  } catch (error) {
    console.error('Error fetching runs:', error);
    throw new Error('Error fetching runs');
  }
};

module.exports = getRunsForUser;