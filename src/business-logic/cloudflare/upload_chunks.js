const Client = require("cloudflare-r2-s3");
const UploadData = Client.UploadData;

async function uploadChunks(streamPath, key) {
  return await UploadData.largeUpload(streamPath, key);
}

module.exports = uploadChunks;
