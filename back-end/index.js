const express = require("express");
const runnerRoutes = require('./src/chase_runner/routes');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const Passage = require("@passageidentity/passage-node");
const cors = require("cors");
const PORT = 3000;
const CLIENT_URL = "http://localhost:3001";
require("dotenv").config();



const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );
const passage = new Passage({
    appID: process.env.PASSAGE_APP_ID,
    apiKey: process.env.PASSAGE_API_KEY,
    authStrategy: "HEADER"
});

app.use("/api/places", runnerRoutes);

app.post("/auth", async (req, res) => {
    try {
      const userID = await passage.authenticateRequest(req);
      if (userID) {
        // user is authenticated
        const { email, phone } = await passage.user.get(userID);
        const identifier = email ? email : phone;
  
        res.json({
          authStatus: "success",
          identifier,
        });
      }
    } catch (e) {
      // authentication failed
      console.log(e);
      res.json({
        authStatus: "failure",
      });
    }
  });
  
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });
  
  client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err));

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });