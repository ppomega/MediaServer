const NodeMediaServer = require("../../../node-media-server/src");
const { exec } = require("child_process");
const fs = require("fs");
const config = {
  rtmp: {
    port: 2500,
  },
  streamName: "test",
  record: {
    path: "../../../",
  },
};
function ffmpeg(session) {
  const streamName = session.streamName;

  fs.mkdirSync(`../../${streamName}/dash`);
  exec(
    `ffmpeg -re -i ../../${streamName}/test.flv  -map 0:v -map 0:v  -map 0:v -map 0:a -c:v libx264 -preset veryfast -g 60 -sc_threshold 0 -b:v:0 3000k -s:v:0 1280x720 -profile:v:0 main  -b:v:1 1500k -s:v:1 854x480  -profile:v:1 main  -b:v:2 800k  -s:v:2 640x360  -profile:v:2 main -c:a aac -b:a 128k -ar 48000  -f dash -streaming 1   -seg_duration 10  -use_template 1 -use_timeline 1 -init_seg_name init_$RepresentationID$.mp4 -media_seg_name chunk_$RepresentationID$_$Number$.m4s ../../${streamName}/dash/manifest.mpd `,
    (err, stdout, stderr) => {
      if (err) console.error(err);
      else console.log(`Processed: `);
      fs.unwatchFile(`../../${streamName}/dash/manifest.mpd`);
      fs.unlinkSync(`../../${streamName}/test.flv`);
    }
  );
  exec(`node mpd.js `, (err, stdout, stderr) => {
    if (err) console.error(err);
    else console.log(`Live Stream Patch Completed`);
  });
}
const app = new NodeMediaServer(config);
app.on("postPublish", (session) => {
  console.log("Bakchodi Nahi Rukegi");
  console.log(new Date().toISOString());
  setTimeout(() => {
    ffmpeg(session);
  }, 3000);
});
app.run();
