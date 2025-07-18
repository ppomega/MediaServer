const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema(
  {
    name: String,
    date: Date,
    status: Number,
    lecturer: String,
  },
  { collection: "batches" }
);

module.exports = mongoose.model("batch", batchSchema);
