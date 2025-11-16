const pool = require('../db');

const storeOrUpdateUser = async (user) => {
    const client = await pool.connect();
    try {
        const { sub, nickname, name, email, picture, email_verified } = user;

        console.log('📥 Storing/updating user:', { sub, email, name });

        // Check if the user already exists
        const result = await client.query(
            'SELECT id FROM users WHERE sub = $1',
            [sub]
        );

        if (result.rows.length === 0) {
            // User does not exist, insert a new record
            await client.query(
                'INSERT INTO users (sub, nickname, name, email, picture, email_verified, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
                [sub, nickname, name, email, picture, email_verified]
            );
            console.log('✅ User inserted');
        } else {
            // User exists, update their details (but don't overwrite custom uploaded picture if it exists)
            const currentUser = await client.query(
                'SELECT picture FROM users WHERE sub = $1',
                [sub]
            );
            
            // Only update picture if user doesn't have a custom one (picture is still from Auth0)
            const shouldUpdatePicture = !currentUser.rows[0].picture || currentUser.rows[0].picture === picture;
            
            if (shouldUpdatePicture) {
                await client.query(
                    'UPDATE users SET email = $1, name = $2, picture = $3, updated_at = NOW() WHERE sub = $4',
                    [email, name, picture, sub]
                );
            } else {
                await client.query(
                    'UPDATE users SET email = $1, name = $2, updated_at = NOW() WHERE sub = $3',
                    [email, name, sub]
                );
            }
            console.log('✅ User updated');
        }
    } catch (err) {
        console.error('❌ Error storing or updating user:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Function to update profile picture (custom uploaded by user)
const updateUserProfilePicture = async (sub, profilePicture) => {
    const client = await pool.connect();
    try {
        console.log('📸 Updating profile picture for:', sub);

        const result = await client.query(
            'UPDATE users SET picture = $1, updated_at = NOW() WHERE sub = $2 RETURNING *',
            [profilePicture, sub]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        console.log('✅ Profile picture updated');
        return result.rows[0];
    } catch (err) {
        console.error('❌ Error updating profile picture:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Function to get user by sub
const getUserBySub = async (sub) => {
    const client = await pool.connect();
    try {
        console.log('👤 Fetching user:', sub);

        const result = await client.query(
            'SELECT * FROM users WHERE sub = $1',
            [sub]
        );

        if (result.rows.length === 0) {
            return null;
        }

        console.log('✅ User found');
        return result.rows[0];
    } catch (err) {
        console.error('❌ Error fetching user:', err);
        throw err;
    } finally {
        client.release();
    }
};

module.exports = {
    storeOrUpdateUser,
    updateUserProfilePicture,
    getUserBySub
};