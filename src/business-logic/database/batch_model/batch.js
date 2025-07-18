const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema(
  {
    name: String,
    duration: Number,
    price: Number,
  },
  { collection: "batches" }
);

module.exports = mongoose.model("batch", batchSchema);
