/**
 * ReadCode backend
 * 
 * pour lancer le serveur : npm run devstart
 * 
 */
require("dotenv").config(".env");
const env = process.env;
const express = require("express");
const app = express();

const dbChallengeQueries = require("./src/services/db_challengeQueries");
dbChallengeQueries.initChallenges();
const dbUserQueries = require("./src/services/db_userQueries.service");
dbUserQueries.initUsers();

/******* PASSPORT ********/
const getUserByUsername = dbUserQueries.getUserByUsername;
const getUserById = dbUserQueries.getUserById;

const session = require("express-session");
const passport = require("passport");
const initializePassport = require('./src/services/passport.service');
initializePassport(passport, getUserByUsername, getUserById);

app.use(
  session({
    secret: env.session_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/** CORS middle-ware **/
const cors = require('cors');
app.use(cors({credentials: true, origin: "http://localhost:3000"}))

/** Parser middleware **/
app.use(express.json());

/** Routeur **/
const userRouter = require("./src/routes/user.route");
const challengeRouter = require("./src/routes/challenge.route");

/** Ajout des routes */
app.use("/user", userRouter);
app.use("/challenge", challengeRouter);

/** Error Handler middleware **/
app.use((err, req, res, next) => {
  console.log(`*-- Error Handler middleware --*`);
  console.error(err.stack);
  console.log(`Error object : ${JSON.stringify(err.message, 2, null)}`)
  const errCode = err?.statusCode || err?.response?.status || 500;
  res.status(errCode).json({ message: err?.message || err});
  return;
});

// message d'accueil sur localhost4000:/
app.get('/', (req,res,next) => {
  res.json("Bienvenue au backend de ReadCode");
})

/** Lancement du serveur **/
const port = env.PORT || 4000;
app.listen(port , "0.0.0.0", () => {
  console.log(`Listening at localhost: ${port}`);
});
