const mongoose = require("mongoose");
const lectureSchema = new mongoose.Schema(
  {
    name: String,
    date: Date,
    status: Number,
    lecturer: String,
    lecture: String,
  },
  { collection: "lectures" }
);

module.exports = mongoose.model("Lecture", lectureSchema);
