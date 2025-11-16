const pool = require('../../db');
const queries = require('./queries');
const util = require('util');
const { storeOrUpdateUser, updateUserProfilePicture, getUserBySub } = require('../../utils/storeOrUpdateUser');


const getGeojson = (req, res) => {
  console.log('here good')
}


const addMarker = (req, res) => {
    const { lat, lon, name, country, state, selectedracetype, user_id } = req.body;
    const values = [lat, lon, name, country, state, selectedracetype, user_id ] 
    pool.query(queries.addMarker, values, (error, results) => {
        if(error) throw error;
        res.status(201).send("Marker added successfully");
    })
}

const geojson_data = async (req, res) => {
  const { lat, lon, name, geojson, race_type, color, description, city, user_id } = req.body;

  try {

      const result = await pool.query(
        queries.geojson_data,
        [lat, lon, name, description, geojson, race_type, color, city, user_id]
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

const updateProfilePicture = async (req, res) => {
  const user_sub = decodeURIComponent(req.params.user_sub);
  const { profile_picture } = req.body;

  console.log('📸 Decoded user_sub:', user_sub);

  try {
    const user = await updateUserProfilePicture(user_sub, profile_picture);
    
    res.status(200).json({
      message: 'Profile picture updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({
      message: 'Error updating profile picture',
      error: error.message
    });
  }
};

const getUser = async (req, res) => {

  console.log('user?')
  const { user_sub } = req.params; // Using user_sub to be clear it's the Auth0 sub

  try {
    const user = await getUserBySub(user_sub);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message
    });
  }
};

const createUser = async (req, res) => {
  console.log('📥 Creating/updating user:', req.body);
  
  try {
    await storeOrUpdateUser(req.body);
    
    // Fetch the user to return
    const user = await getUserBySub(req.body.sub);
    
    res.status(201).json({
      message: 'User created/updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  console.log('=== UPDATE USER ===');
  const user_sub = decodeURIComponent(req.params.user_sub);
  const { name, nickname } = req.body;

  console.log('📝 Updating user:', user_sub);
  console.log('📝 New name:', name);
  console.log('📝 New nickname:', nickname);

  try {
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }

    if (nickname !== undefined) {
      updates.push(`nickname = $${paramIndex}`);
      values.push(nickname);
      paramIndex++;
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`);
    
    // Add user_sub as the LAST value
    values.push(user_sub);
    
    // Use paramIndex for WHERE clause (it's already incremented correctly)
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE sub = $${paramIndex} 
      RETURNING *
    `;

    console.log('🔍 Query:', query);
    console.log('🔍 Values:', values);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User updated:', result.rows[0]);
    res.status(200).json({
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      message: 'Error updating user',
      error: error.message
    });
  }
};
  

module.exports = {
    getGeojson,
    addMarker,
    geojson_data,
    updateProfilePicture,
    getUser,
    createUser,
    updateUser
};

