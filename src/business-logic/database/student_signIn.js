const mongoose = require("mongoose");
const student = require("./student_model/student.js");

async function studentSignIn(Username, Password, email) {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const result = await student.find({ Email: email });
  if (result.length != 0) {
    return null;
  } else {
    await student.insertOne({
      Username: Username,
      Password: Password,
      Email: email,
    });
  }
  return result;
}
module.exports = studentSignIn;
