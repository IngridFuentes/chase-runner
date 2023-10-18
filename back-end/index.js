const express = require("express");
const Passage = require("@passageidentity/passage-node");
const cors = require("cors");
const PORT = 3000;
const CLIENT_URL = "http://localhost:3001";


const app = express();
app.use(express.json());
app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );
  require("dotenv").config();

  const passageConfig = {
    appID: process.env.PASSAGE_APP_ID,
    apiKey: process.env.PASSAGE_API_KEY,
  };

  let passage = new Passage(passageConfig);
  app.get("/authenticatedRoute", async(req, res) => {
    try {
      // Authenticate request using Passage
      let userID = await passage.authenticateRequest(req);
      // let passageUser = await passage.user.get(userID);
      // console.log(passageUser.email)
      if (userID) {
        // User is authenticated
        let userData = await passage.user.get(userID);
        console.log(userData);
      }
    } catch (e) {
      // Authentication failed
      console.log(e);
      res.send("Authentication failed!");
    }
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });