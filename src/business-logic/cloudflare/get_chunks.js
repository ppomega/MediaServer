const Client = require("index.js");
const getObject = Client.GetObject;

async function getChunks(path) {
  return await getObject.getObject(path);
}

module.exports = getChunks;
