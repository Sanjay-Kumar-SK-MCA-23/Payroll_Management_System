const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const adminRoute = require("./router/adminRoute");
const employeeRoute = require("./router/employeeRoute");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//=================Routes=================
app.use("/api", adminRoute);
app.use("/api", employeeRoute);
app.use("/api/images", express.static("Pictures"));


module.exports = app;
