const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const getChunks = require("../../business-logic/cloudflare/get_chunks.js");
const getBatches = require("../database/batch_info.js");
const getTopics = require("../database/topic_info.js");
const studentLogin = require("../database/student_login.js");
const studentSignIn = require("../database/student_signIn.js");
const getLectureByNameAndBatch = require("../database/lect_info_name.js");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bakchodi Nahi Rukegi ");
});
app.get("/login", async (req, res) => {
  const Username = req.headers.Username;
  const Password = req.headers.Password;
  console.log(Username);
  console.log(Password);
  const result = await studentLogin(Username, Password);
  res.send(result);
});
app.get("/signIn", async (req, res) => {
  const Username = req.headers.Username;
  const Password = req.headers.Password;
  const Email = req.headers.Email;
  const result = await studentSignIn(Username, Password, Email);
  res.send(result);
});
app.get("/topics/:batch", async (req, res) => {
  res.send(await getTopics(req.params.batch));
});
app.get("/lecture/:batch/:name", async (req, res) => {
  console.log(req.params.name);
  res.send(await getLectureByNameAndBatch(req.params.name, req.params.batch));
});
app.get("/batches", async (req, res) => {
  res.send(await getBatches());
});
app.get("/file/:author/:topic/:lecture/:name", async (req, res) => {
  console.log(req.params);
  const lecture = req.params.lecture;
  const author = req.params.author;
  const topic = req.params.topic;
  console.log(req.params);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (fs.existsSync(`./${author}/${topic}/${lecture}`)) {
    console.log("Koi Mil gaya");
    res.sendFile(
      path.resolve(`./${author}/${topic}/${lecture}/dash/` + req.params.name)
    );
  } else {
    const r = await getChunks(
      `${author}/${topic}/${lecture}/dash/` + req.params.name
    );
    console.log(r.status);
    r.data.pipe(res);
  }
});

module.exports = app;
