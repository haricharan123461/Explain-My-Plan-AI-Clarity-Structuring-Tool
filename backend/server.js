const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const planRoutes = require("./routes/planRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/kalnet")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api", planRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});