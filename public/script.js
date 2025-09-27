const socket = io();
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const chatbox = document.getElementById("chatbox");
const onlinemembers = document.getElementById("onlinemembers");
const form = document.getElementById("chat-form");

const username = prompt("Enter Your Name: ");

// send username to server
socket.emit("join", username);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() !== "") {
    const message = username + " : " + input.value;
    socket.emit("chat message", message);
    input.value = "";
  }
});

// receive chat messages
socket.on("chat message", (msg) => {
  let ch = document.createElement("p");
  ch.classList.add("chat");
  ch.innerHTML = msg;
  chatbox.append(ch);
  chatbox.scrollTop = chatbox.scrollHeight;
});

// update online members
socket.on("online users", (users) => {
  onlinemembers.innerHTML = ""; // clear old list
  users.forEach(user => {
    let li = document.createElement("p");
    li.classList.add("onlineme");
    li.textContent = user;
    onlinemembers.append(li);
  });
});
