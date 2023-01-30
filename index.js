const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

const userRouter = require("./backend/routes/authRouter");

const cors = require("cors");

app.use(cors());
app.use("/request", userRouter);

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error :"));

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
