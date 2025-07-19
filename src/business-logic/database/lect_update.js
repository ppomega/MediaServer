const Lecture = require("./lecture_model/lecture");
const mongoose = require("mongoose");

async function updateLectureByName(lectureName, Name, topic, status) {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const lect_obj = await Lecture.updateOne(
    { name: topic, lecturer: Name, lecture: lectureName },
    { status: status }
  );
  console.log(lect_obj);
  await mongoose.connection.close();
  return lect_obj;
}

module.exports = updateLectureByName;
