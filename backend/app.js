const express = require("express");
const cors = require('cors');
const indexRouter = require("./routes/index.js");

const { auth } = require('express-openid-connect');
require("dotenv").config();


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
  };

const app = express();
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded( { extended:true }))
app.use(express.static("public"))
app.use(auth(config));

app.use(cors({
  origin: 'https://chase-runner.vercel.app/',
  credentials: true,
}));

app.use("/", indexRouter);
app.use("/runs", indexRouter);
app.use("/user/id/runs", indexRouter);



app.listen(3000, () => {
    console.log("Express is running in port 3000")
});