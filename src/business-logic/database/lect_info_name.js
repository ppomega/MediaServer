const Lecture = require("./lecture_model/lecture");
const mongoose = require("mongoose");

async function getLectureByNameAndBatch(lectureName, author) {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const lect_obj = await Lecture.find({ name: lectureName, lecturer: author });
  console.log(lect_obj);
  await mongoose.connection.close();
  return lect_obj;
}

module.exports = getLectureByNameAndBatch;
