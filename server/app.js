"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
// const mongodb = require("./config/db");

/**
 * @description import custom route
 */
const UserRoutes = require("./routes/UserRoute");

app.use(cors());

// mongodb();
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.get("/api", (req, res) => {
  var response = {
    success: 1,
    message: "Welcome to new era of Collections",
  };
  res.status(200).json(response);
});

app.use("/api/user", UserRoutes);

/**
 * @description Page NOT FOUND Error
 */
app.use((req, res) => {
  return res.status(404).json({
    success: 0,
    message: `NOT FOUND ${req.originalUrl}`,
  });
});

module.exports = app;
