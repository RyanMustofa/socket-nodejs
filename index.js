const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.argv[2] || 1009;
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", express.static("views"));

if (io) {
  require("./ws")(io);
}

server.listen(port, () => {
  console.log("Listening in port " + port);
});
