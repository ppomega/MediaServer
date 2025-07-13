const Client = require("index.js");
const UploadData = Client.UploadData;

async function uploadChunks(streamPath, key) {
  return await UploadData.largeUpload(streamPath, key);
}

module.exports = uploadChunks;
