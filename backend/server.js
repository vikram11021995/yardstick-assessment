const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));
app.use("/tenants", require("./routes/tenantRoutes"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("DB connected");
  app.listen(process.env.PORT, () => console.log("Server running"));
});

