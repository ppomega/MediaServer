const Lecture = require("./lecture_model/lecture");
const mongoose = require("mongoose");

async function createLecture(lecture) {
  mongoose.set("debug", true);

  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const doc = new Lecture({
    name: lecture.name,
    date: lecture.date,
    status: lecture.status,
    lecturer: lecture.author,
    lecture: lecture.lecture,
  });
  const result = await doc.save();
  console.log(result);
  await mongoose.connection.close();
  return result;
}

module.exports = createLecture;
