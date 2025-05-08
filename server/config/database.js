const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const database = asyncHandler(async (req, res) => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => {
      console.log(`database connected on ${con.connection.name}`);
    })
    .catch((err) => {
      console.log(`database conection error : ${err}`);
    });
});

module.exports = database;
