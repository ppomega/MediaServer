const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const getChunks = require("../../business-logic/cloudflare/get_chunks.js");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bakchodi Nahi Rukegi ");
});
app.get("/file/:name", async (req, res) => {
  const lecture = req.query.params["lecture"];
  const author = req.query.params["author"];
  console.log(req.params.name);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (fs.existsSync(`./${lecture}`)) {
    res.sendFile(path.resolve(`./${lecture}/dash/` + req.params.name));
  } else {
    res.pipe(await getChunks(`./${lecture}/dash/` + req.params.name));
  }
});

module.exports = app;
