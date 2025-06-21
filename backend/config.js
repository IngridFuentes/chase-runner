require('dotenv').config();

const config = {
    development: {
        port: process.env.PORT || 3000,
        corsOrigin: 'http://localhost:3001',
        database: {
            host: 'localhost',
            port: 5432,
            database: 'chase_runner',
            user: 'ingridfuentes',
            password: 'postgres'
        },
        auth0: {
            jwksUri: process.env.AUTH0_JWKS_URI,
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER
        }
    },
    production: {
        port: process.env.PORT || 3000,
        corsOrigin: 'https://chase-runner.vercel.app',
        database: {
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD
        },
        auth0: {
            jwksUri: process.env.AUTH0_JWKS_URI,
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER
        }
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env]; 