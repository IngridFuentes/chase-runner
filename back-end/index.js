const express = require("express");
const runnerRoutes = require('./src/chase_runner/routes');
const userRoutes = require('./routers/authRouter');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { auth } = require('express-openid-connect');
// const Passage = require("@passageidentity/passage-node");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt = 10;
const PORT = 3000;
const CLIENT_URL = "http://localhost:3001";
require("dotenv").config();


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL:process.env.ISSUER
};

const app = express();
app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );
  console.log("Debugging middleware initialization - Configuration Object:");
  console.log(config);

app.use(auth(config));
app.use(cookieParser());

// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.post('/signup', async (req, res) => {
//   const { email, username, password } = req.body;

//   try {
//     // Hash the password
//     const hash = await bcrypt.hash(password, salt);

//     // Insert user data into the database
//     const postgres = "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)";
//     await client.query(postgres, [email, username, hash]);

//     // Send success response
//     return res.json({ status: "Success" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });


// Middleware to verify JWT and extract user ID
// const authenticateUser = (req, res, next) => {
//   // Extract JWT from request headers
//   const token = req.headers.authorization.split(' ')[1];

//   console.log(token, 'token')

//   // Verify JWT
//   jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//     if (err) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//     // Extract user ID from decoded token
//     req.userId = decodedToken.userId;
//     next();
//   });
// };

// // Example route handler that requires authentication
// app.get('/protected-route', authenticateUser, (req, res) => {
//   const userId = req.userId; // User ID extracted from JWT token

//   // Example: Query the database for user-specific data
//   const query = 'SELECT * FROM users WHERE user_id = $1';
//   client.query(query, [userId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: 'Database error' });
//     }
//     // Handle successful database query and return user-specific data
//     return res.status(200).json({ userData: result.rows });
//   });
// });

// Middleware to authenticate incoming requests
const authenticate = (req, res, next) => {
  // Check if the user is authenticated (e.g., validate authentication token)
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware
  } else {
    return res.status(401).json({ error: 'Unauthorized' }); // User is not authenticated, send 401 Unauthorized status
  }
};

// Route for a specific user
app.get('/user/:userId', authenticate, (req, res) => {
  const { userId } = req.params;
  // Check if the authenticated user is authorized to access this route
  if (req.user.id === userId) {
    // User is authorized, return user-specific data
    res.json({ userId, data: 'User-specific data' });
  } else {
    // User is not authorized, send 403 Forbidden status
    res.status(403).json({ error: 'Forbidden' });
  }
});





app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user data into the database
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
    const result = await client.query(query, [username, email, hashedPassword]);

    // Extract the newly generated user ID
    const userId = result.rows[0].id;

    console.log(userId, "user id backend")
    // Return the user ID in the response
    return res.status(201).json({ userId });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Query to retrieve user data based on email
//     const query = 'SELECT * FROM users WHERE email = $1';
//     const result = await client.query(query, [email]);

//     // Check if a user with the provided email exists
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Retrieve the hashed password from the query result
//     const hashedPassword = result.rows[0].password;

//     // Compare the provided password with the hashed password
//     const match = await bcrypt.compare(password, hashedPassword);

//     // Check if the passwords match
//     if (!match) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // Passwords match, login successful
//     return res.status(200).json({ status: 'Success' });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });




app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to retrieve user data based on email
    const query = 'SELECT id, password FROM users WHERE email = $1';
    const result = await client.query(query, [email]);

    // Check if a user with the provided email exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve the user ID and hashed password from the query result
    const { id, password: hashedPassword } = result.rows[0];

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, hashedPassword);

    // Check if the passwords match
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Passwords match, login successful
    return res.status(200).json({ userId: id, status: 'Success' });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



// const passage = new Passage({
//     appID: process.env.PASSAGE_APP_ID,
//     apiKey: process.env.PASSAGE_API_KEY,
//     authStrategy: "HEADER"
// });
app.use("/", userRoutes);
app.use("/api/places", runnerRoutes);



// app.post("/auth", async (req, res) => {
//     try {
//       const userID = await passage.authenticateRequest(req);
//       if (userID) {
//         // user is authenticated
//         const { email, phone } = await passage.user.get(userID);
//         const identifier = email ? email : phone;
  
//         res.json({
//           authStatus: "success",
//           identifier,
//         });
//       }
//     } catch (e) {
//       // authentication failed
//       console.log(e);
//       res.json({
//         authStatus: "failure",
//       });
//     }
//   });
  
  const client = new Client({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
  });
  
  client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err));

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
  const expressListEndpoints = require('express-list-endpoints');
  const routes = expressListEndpoints(app);
console.log(routes);

// module.exports = app;
