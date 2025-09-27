const socket = io();
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const chatbox = document.getElementById("chatbox");
const form = document.getElementById("chat-form");

const username = prompt("Enter Your Name: ");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() !== "") {
    const message = username + " : " + input.value;
    socket.emit("chat message", message);
    input.value = "";
  }
});

// receive message
socket.on("chat message", (msg) => {
  let ch = document.createElement("p");
  ch.classList.add("chat");
  ch.innerHTML = msg;
  chatbox.append(ch);

  // auto scroll to bottom
  chatbox.scrollTop = chatbox.scrollHeight;
});
