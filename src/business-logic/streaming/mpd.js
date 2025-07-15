const fs = require("fs");
const path = require("path");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const args = process.argv.slice(2);

const mpdPath = path.join(`${args}`);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressBooleanAttributes: false,
  processEntities: false,
});

function forceArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

function patchSegmentTemplate(segTemplate) {
  if (!segTemplate) return;

  segTemplate["@_availabilityTimeComplete"] = "true";
  segTemplate["@_availabilityTimeOffset"] = "3";

  const timeline = segTemplate.SegmentTimeline;
  if (timeline?.S) {
    timeline.S = forceArray(timeline.S);
    for (const s of timeline.S) {
      delete s["@_t"];
    }
  }
}

function patchMPD() {
  if (!fs.existsSync(mpdPath)) return;

  const xml = fs.readFileSync(mpdPath, "utf-8");
  const json = parser.parse(xml);

  const period = json.MPD?.Period;
  if (!period) return;

  const adaptationSets = forceArray(period.AdaptationSet);

  for (const adaptation of adaptationSets) {
    if (adaptation.SegmentTemplate) {
      patchSegmentTemplate(adaptation.SegmentTemplate);
    }

    const reps = forceArray(adaptation.Representation);
    for (const rep of reps) {
      if (rep.SegmentTemplate) {
        patchSegmentTemplate(rep.SegmentTemplate);
      }
    }
  }

  const newXml = builder.build(json);
  fs.writeFileSync(mpdPath, newXml, "utf-8");
  console.log(` Patched MPD at ${new Date().toISOString()}`);
}

fs.watchFile(mpdPath, { interval: 1000 }, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    try {
      patchMPD();
    } catch (e) {
      console.error("Error patching MPD:", e.message);
    }
  }
});

console.log(`Watching for changes in ${mpdPath}`);
