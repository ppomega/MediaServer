const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const getChunks = require("../../business-logic/cloudflare/get_chunks.js");
const getBatches = require("../database/bacth_info.js");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bakchodi Nahi Rukegi ");
});

app.get("/batches", async (req, res) => {
  res.send(await getBatches());
});
app.get("/file/:author/:lecture/:name", async (req, res) => {
  console.log(req.params);
  const lecture = req.params.lecture;
  const author = req.params.author;
  console.log(req.params.name);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (fs.existsSync(`./${author}/${lecture}`)) {
    res.sendFile(
      path.resolve(`./${author}/${lecture}/dash/` + req.params.name)
    );
  } else {
    const r = await getChunks(`${author}/${lecture}/dash/` + req.params.name);
    console.log(r.status);
    r.data.pipe(res);
  }
});

module.exports = app;
