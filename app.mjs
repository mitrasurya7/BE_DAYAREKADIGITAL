import dotenv from "dotenv";
if ( process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import router from "./router/index.mjs";
import connection from "./library/database.mjs";
const app = new express();


connection.connect((err) => {
  if (err) {
    console.log(err);
    console.log("Error connecting to Db");
  } else {
    console.log("Connection established");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});



export default app;