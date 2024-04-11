
// const express = require("express");
// const validateForm = require("../controllers/validateForm");
// const router = express.Router();

// router.post("/login", (req, res) => {
//     validateForm(req, res);
// });

// router.post("/signup", (req, res) => {
//     validateForm(req, res);
// });

// router.post("/logout", (req, res) => {
//     validateForm(req, res);
// });
// module.exports = router;

const express = require('express');
const router = express.Router();
// const { login, signup, logout } = require('../src/chase_runner/routes');

// router.post('/login', login);
// router.post('/signup', signup);
// router.post('/logout', logout);

router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated())
    res.render("index", { title: "Express Demo" });
})

router.get("/map", (req, res) => {
    console.log('map server')
})


module.exports = router;