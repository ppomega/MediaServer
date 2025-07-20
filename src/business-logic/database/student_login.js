const mongoose = require("mongoose");
const student = require("./student_model/student.js");

async function studentLogin(Username, Password) {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const result = await student.find({ Username: Username, Password: Password });

  return result;
}
module.exports = studentLogin;
