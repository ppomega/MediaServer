const Batch = require("./batch_model/batch");
const mongoose = require("mongoose");

async function getBatches() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const batches = await Batch.find();
  await mongoose.connection.close();
  return batches;
}

module.exports = getBatches;
