const rtmp_server = require("./src/business-logic/streaming/rtmpServer.js");
const route_server = require("./src/business-logic/streaming/routeServer.js");
const dotenv = require("dotenv");
dotenv.config();
rtmp_server.run();
route_server.listen(8000, () => {
  console.log("Route Server Started on port 8000");
});
