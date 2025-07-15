const mongoose = require("mongoose");
const lectureSchema = new mongoose.Schema({
  name: String,
  date: Date,
  status: Number,
  lecturer: String,
});

module.exports = mongoose.model("Lecture", lectureSchema);
