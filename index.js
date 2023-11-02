require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoute = require("./routes/auth");

const PORT = process.env.PORT;
const app = express();
const DB = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.l4r4akz.mongodb.net/?retryWrites=true&w=majority`;

app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(authRoute);

app.get("/", (req, res, next) => {
  console.log("rr");
  const aa = "aa";
  return res.json({ aa });
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((error) => {
    console.log("error: ", error);
  });
// app.listen(PORT,"0.0.0.0" () => {
app.listen(PORT, () => {
  console.log("Connected at http://localhost:" + PORT);
});
