const CloudflareR2 = require("cloudflare-r2-s3");

const Client = new CloudflareR2({
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
  host: process.env.CLOUDFLARE_HOST,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: "media-server",
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
});
module.exports = Client;
