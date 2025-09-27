const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

let users = {}; // socket.id -> username

io.on("connection", (socket) => {
  console.log("A user connected");

  // when user joins
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("online users", Object.values(users)); // send updated list
  });

  // when user sends message
socket.on("chat message", (data) => {
  io.emit("chat message", data); // data = {user, type, content}
});

  // when user disconnects
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("online users", Object.values(users)); // update list
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
