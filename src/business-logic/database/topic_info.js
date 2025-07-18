const Topic = require("./topic_model/topic");
const mongoose = require("mongoose");

async function getTopics(name) {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const topics = await Topic.find({ batch: name });
  await mongoose.connection.close();
  return topics;
}

module.exports = getTopics;
