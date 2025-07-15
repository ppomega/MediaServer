const Lecture = require("./lecture_model/lecture");
const mongoose = require("mongoose");

async function getLectureByName(lectureName) {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const lect_obj = await Lecture.find({ name: lectureName });
  console.log(lect_obj);
  await mongoose.connection.close();
  return lect_obj;
}

module.exports = getLectureByName;
