const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    Username: String,
    Password: String,
    Email: String,
  },
  { collection: "students" }
);

module.exports = mongoose.model("student", studentSchema);
