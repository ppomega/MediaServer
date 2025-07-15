const Client = require("cloudflare-r2-s3");
const getObject = Client.GetObject;

async function getChunks(path) {
  return await getObject.getObject(path);
}

module.exports = getChunks;
