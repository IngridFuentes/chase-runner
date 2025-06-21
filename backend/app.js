const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const axios = require('axios');
const config = require('./config');
const storeOrUpdateUser = require('./utils/storeOrUpdateUser');
const storeOrUpdateRun = require('./utils/storeOrUpdateRun');
const getRunsForUser = require('./utils/getRunsForUser');
const pool = require('./db');

const app = express();
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const corsOptions = {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

// JWT verification middleware
const verifyJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config.auth0.jwksUri
    }),
    algorithms: ['RS256'],
    audience: config.auth0.audience,
    issuer: config.auth0.issuer,
}).unless({ path: ['/', '/favicon.ico'] });

app.use(verifyJwt);

// Log authentication info for debugging
app.use((req, res, next) => {
  console.log('Auth info:', req.auth);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

app.get("/user/id/runs", async (req, res) => {
  console.log("Protected route reached");
  
  if (!req.auth || !req.auth.sub) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  
  const userId = req.auth.sub;
  console.log("Fetching runs for user:", userId);
  
  const client = await pool.connect();

  try {
    const userCheckQuery = `SELECT sub FROM users WHERE sub = $1`;
    const userResult = await client.query(userCheckQuery, [userId]);

    if (userResult.rowCount === 0) {
      // If user doesn't exist, create a new user
      const insertUserQuery = `INSERT INTO users (sub) VALUES ($1) RETURNING sub`;
      const newUserResult = await client.query(insertUserQuery, [userId]);
      console.log("New user created with ID:", newUserResult.rows[0].sub);
    } else {
      console.log("User already exists with ID:", userResult.rows[0].sub);
    }

    // Await the result of getRunsForUser, since it's async
    const runs = await getRunsForUser(userId);
    console.log(runs, 'runs backend');

    // Send the runs data as a response
    res.json(runs);
  } catch (error) {
    console.error("Error fetching runs:", error);
    res.status(500).json({ error: "Error fetching runs", details: error.message });
  } finally {
    client.release();
  }
});

app.post('/runs', async (req, res) => {
  try {
    const runData = req.body;
    
    // Validate required fields
    const requiredFields = ['lat', 'lon', 'name', 'description', 'geojson', 'race_type', 'color'];
    const missingFields = requiredFields.filter(field => !runData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        missingFields 
      });
    }

    console.log("Saving run data:", runData);
    await storeOrUpdateRun(runData);
    
    res.status(201).json({ 
      message: 'Run added successfully',
      run: runData
    });
  } catch (err) {
    console.error('Error storing run:', err);
    res.status(500).json({ 
      error: 'Error storing run',
      details: err.message 
    });
  }
});

app.get('/protected', (req, res) => {
  console.log("Protected route reached");
  console.log("JWT payload:", req.auth);
    res.send(req.auth);
});

app.delete('/runs/:id', async (req, res) => {
  const placeId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM runs WHERE id = $1 RETURNING *', [placeId]);

    if (result.rows.length === 0) {
      return res.status(406).json({ message: 'Place not found' });
    }

    res.status(200).json({ message: 'Place deleted successfully', deletedPlace: result.rows[0] });
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ message: 'Failed to delete place', error: error.message });
  }
});

// Error handling middleware
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).send(message);
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
}

module.exports = app;
