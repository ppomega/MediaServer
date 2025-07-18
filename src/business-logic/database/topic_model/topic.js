const mongoose = require("mongoose");
const topicSchema = new mongoose.Schema(
  {
    name: String,

    batch: String,
  },
  { collection: "topics" }
);

module.exports = mongoose.model("topic", topicSchema);
