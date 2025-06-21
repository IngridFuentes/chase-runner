const config = {
    development: {
        apiUrl: 'http://localhost:3000',
        auth0Domain: process.env.REACT_APP_AUTH0_DOMAIN,
        auth0ClientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
        auth0Audience: process.env.REACT_APP_AUTH0_AUDIENCE
    },
    production: {
        apiUrl: 'https://chase-runner-backend.vercel.app',
        auth0Domain: process.env.REACT_APP_AUTH0_DOMAIN,
        auth0ClientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
        auth0Audience: process.env.REACT_APP_AUTH0_AUDIENCE
    }
};

const env = process.env.REACT_APP_ENV || 'development';

export default config[env]; 