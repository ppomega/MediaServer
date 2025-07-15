const Client = require("cloudflare-r2-s3");

async function getChunks(path) {
  const C = new Client({
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    host: process.env.CLOUDFLARE_HOST,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    bucket: process.env.CLOUDFLARE_BUCKET,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  });
  const r = await C.GetObject.getObject(path);

  return r;
}

module.exports = getChunks;
