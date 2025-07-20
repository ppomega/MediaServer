const NodeMediaServer = require("../../../node-media-server/src");
const { exec } = require("child_process");
const fs = require("fs");
const fsPromises = require("fs/promises");
const Client = require("../../business-logic/cloudflare/index.js");
const path = require("path");
const lect_create = require("../database/lect_create.js");
const lect_update = require("../database/lect_update.js");
const config = {
  rtmp: {
    port: 2500,
  },
  streamName: "test",
  record: {
    path: "./",
  },
};
function ffmpeg(session) {
  const streamName = session.streamName;

  fs.mkdirSync(
    `./${session.searchParams.get("name")}/${session.searchParams.get(
      "topic"
    )}/${streamName}/dash`
  );
  exec(
    `ffmpeg -re -i './${session.searchParams.get(
      "name"
    )}/${session.searchParams.get(
      "topic"
    )}/${streamName}/test.flv'  -map 0:v -map 0:v  -map 0:v -map 0:a -c:v libx264 -preset veryfast -g 60 -sc_threshold 0 -b:v:0 3000k -s:v:0 1280x720 -profile:v:0 main  -b:v:1 1500k -s:v:1 854x480  -profile:v:1 main  -b:v:2 800k  -s:v:2 640x360  -profile:v:2 main -c:a aac -b:a 128k -ar 48000  -f dash -streaming 1   -seg_duration 10  -use_template 1 -use_timeline 1 -init_seg_name 'init_$RepresentationID$.mp4' -media_seg_name 'chunk_$RepresentationID$_$Number$.m4s' './${session.searchParams.get(
      "name"
    )}/${session.searchParams.get("topic")}/${streamName}/dash/manifest.mpd' `,
    (err, stdout, stderr) => {
      if (err) console.error(err);
      else console.log(`Processed: `);
      fs.unwatchFile(
        `${session.searchParams.get("name")}/${session.searchParams.get(
          "topic"
        )}/${streamName}/dash/manifest.mpd`
      );
      fs.unlinkSync(
        `${session.searchParams.get("name")}/${session.searchParams.get(
          "topic"
        )}/${streamName}/test.flv`
      );
      app.emit(
        "RecordComplete",
        streamName,
        session.searchParams.get("name"),
        session.searchParams.get("topic")
      );
    }
  );
  exec(
    `node ./src/business-logic/streaming/mpd.js "${path.resolve(
      `${session.searchParams.get("name")}/${session.searchParams.get(
        "topic"
      )}/${streamName}/dash/manifest.mpd"`
    )}`,
    (err, stdout, stderr) => {
      if (err) console.error(err);
      if (stderr) console.error(stderr);
      else console.log(`Live Stream Patch Completed`);
    }
  );
}
const app = new NodeMediaServer(config);
app.on("RecordComplete", async (streamName, name, topic) => {
  const C = new Client({
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    host: process.env.CLOUDFLARE_HOST,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    bucket: process.env.CLOUDFLARE_BUCKET,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  });
  const files = await fsPromises.readdir(`./${name}/${topic}/${streamName}`, {
    recursive: true,
  });
  async function uploadFiles() {
    for (const file of files) {
      console.log(`Uploading file: ${file}`);
      if (file == "dash") {
        continue;
      }
      await C.UploadData.smallUpload(
        path.resolve(`./${name}/${topic}/${streamName}`, file),
        name + "/" + topic + "/" + streamName + "/" + file.replace(/\\/g, "/")
      );
    }
  }
  await uploadFiles();
  await lect_update(streamName, name, topic, 1);
  fs.rmSync(path.resolve(`./${name}`), { recursive: true, force: true });
});
app.on("postPublish", async (session) => {
  console.log("Bakchodi Nahi Rukegi");
  const lecture = {
    name: session.searchParams.get("topic"),
    author: session.searchParams.get("name"),
    status: 0,
    lecture: session.streamName,
    date: new Date().toISOString(),
  };

  setTimeout(() => {
    ffmpeg(session);
  }, 3000);
  await lect_create(lecture);
});
module.exports = app;
