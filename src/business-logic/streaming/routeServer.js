const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
app.use(cors());
app.use(express.json());
app.listen(8000, () => {
  console.log("Dash Server Started");
});

app.get("/", (req, res) => {
  res.send("Bakchodi Nahi Rukegi ");
});
app.get("/file/:name", (req, res) => {
  console.log(req.params.name);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  res.sendFile(path.resolve(".", "../../mystream/dash/" + req.params.name));
});
