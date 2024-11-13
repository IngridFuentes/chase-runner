const express = require("express");
const router = express.Router();
const storeOrUpdateUser = require('../utils/storeOrUpdateUser');
const storeOrUpdateRun = require('../utils/storeOrUpdateRun');
const getRunsForUser = require('../utils/getRunsForUser');

router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated());
    res.render("index", { 
        title: "Express Auth", 
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
    })
    // console.log(req.oidc.user, "user 2")
})

//route to see user ID

router.get("/user/id", async (req, res) => {
    if (!req.oidc || !req.oidc.user) {
        return res.status(401).send('User not authenticated');
    }

    const user = req.oidc.user;
    await storeOrUpdateUser(user); // Call the function to store or update user data

    res.render("index", {
        title: "Express Auth User Id", 
        isAuthenticated: req.oidc.isAuthenticated(),
        user: `${user.sub} ${user.name}`
    });
});

// route to POST runs after user authenticate

router.post('/runs', async (req, res) => {
    if (!req.oidc || !req.oidc.user) {
        return res.status(401).send("User not authenticated");
      }
    
    const runData = req.body;

    try {
      await storeOrUpdateRun(runData);
      res.status(201).send('Run added successfully');
    } catch (err) {
      res.status(500).send('Error storing run');
    }
});


// route to get all runs for a user
router.get("/user/id/runs", async (req, res) => {

    if (!req.oidc.isAuthenticated()) {
      return res.status(401).send('User not authenticated');
    }
  
    const userId = req.oidc.user.sub;
    console.log('Fetching runs for user: ', userId);
  
    try {
      // Use the imported function to fetch runs
      const runs = await getRunsForUser(userId);
  
      // Check if the user has any runs
      if (runs.length === 0) {
        return res.status(404).send('No runs found for this user');
      }
  
      // Send the runs as a response
      res.status(200).json(runs);
    } catch (error) {
      console.error('Error fetching runs:', error);
      res.status(500).send('Error fetching runs');
    }
  });


module.exports = router;