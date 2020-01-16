const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();
const knex = require("knex");

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require('./controllers/image')
const database_pass = require("./config.js").db_pass;

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "naveen",
    password: database_pass,
    database: "smart-brain"
  }
});

app.use(cors());
app.use(bodyParser.json());

// SIGNIN Route => POST
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
