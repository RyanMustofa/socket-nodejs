const { randomUUID } = require("crypto");
const moment = require("moment");

let client = [];

function Socket(io) {
  io.use((socket, next) => {
    let sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      let sessions = client.find((el) => el.sessionID === sessionID);
      console.log("id session", sessions);
      socket.sessionID = sessions.sessionID;
      socket.userID = sessions.userID;
      socket.status_connection = false;
    }
    socket.sessionID = randomUUID();
    socket.userID = randomUUID();
    socket.status_connection = true;
    socket.username = socket.handshake.auth.username || "bot";
    next();
  });
  io.on("connection", (socket) => {
    console.log("connected", socket.username, socket.sessionID);
    socket.on("test", (message) => {
      let { username, to } = JSON.parse(message);
      socket.username = username;
      if (client.find((el) => el.username === socket.username)) {
        let index = client.findIndex((el) => el.username === socket.username);
        client[index] = {
          ...client[index],
          sessionID: socket.sessionID,
          userID: socket.userID,
          status_connection: true,
          id: socket.id,
        };
      } else {
        client.push({
          username: username,
          sessionID: socket.sessionID,
          userID: socket.userID,
          status_connection: true,
          id: socket.id,
        });
      }
      socket.broadcast.emit("run", client);
      socket.emit("run", client);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
      if (client.find((el) => el.username === socket.username)) {
        let index = client.findIndex((el) => el.username === socket.username);
        client[index] = {
          ...client[index],
          sessionID: socket.sessionID,
          userID: socket.userID,
          status_connection: false,
          id: socket.id,
        };
      }
    });
  });
  setInterval(() => {
    io.emit("run", client);
  }, 1000);
  console.log(client);
}

module.exports = Socket;
