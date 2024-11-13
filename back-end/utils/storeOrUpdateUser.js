const pool = require('../db');

const storeOrUpdateUser = async (user) => {
    const client = await pool.connect();
    try {
        const { sub, nickname, name, email, picture, email_verified } = user;

        // Check if the user already exists
        const result = await client.query(
            'SELECT id FROM users WHERE sub = $1',
            [sub]
        );

        if (result.rows.length === 0) {
            // User does not exist, insert a new record
            await client.query(
                'INSERT INTO users (sub, nickname, name, email, picture, email_verified) VALUES ($1, $2, $3, $4, $5, $6)',
                [sub, nickname, name, email, picture, email_verified]
            );
            console.log('User inserted');
        } else {
            // User exists, update their details
            await client.query(
                'UPDATE users SET email = $1, name = $2, picture = $3 WHERE sub = $4',
                [email, name, picture, sub]
            );
            console.log('User updated');
        }
    } catch (err) {
        console.error('Error storing or updating user:', err);
    } finally {
        client.release();
    }
};

module.exports = storeOrUpdateUser;
