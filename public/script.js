const socket = io();
const input = document.getElementById("input");
const chatbox = document.getElementById("chatbox");
const onlinemembers = document.getElementById("onlinemembers");
const form = document.getElementById("chat-form");
const imageUpload = document.getElementById("imageUpload");
const stickers = document.querySelectorAll(".sticker");

const uploadBtn = document.getElementById("uploadBtn");

// When div is clicked, trigger file input
uploadBtn.addEventListener("click", () => {
  imageUpload.click(); // programmatically open file picker
});

const username = prompt("Enter Your Name: ");
socket.emit("join", username);

// Single send handler
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value.trim() !== "") {
    // send text
    socket.emit("chat message", {
      user: username,
      type: "text",
      content: input.value
    });
    input.value = "";
  } 
  else if (imageUpload.files.length > 0) {
    // send image
    const reader = new FileReader();
    reader.onload = function(e) {
      socket.emit("chat message", {
        user: username,
        type: "image",
        content: e.target.result
      });
    };
    reader.readAsDataURL(imageUpload.files[0]);
    imageUpload.value = "";
  }
});

// Stickers → send immediately
stickers.forEach(sticker => {
  sticker.addEventListener("click", () => {
    socket.emit("chat message", {
      user: username,
      type: "sticker",
      content: sticker.src
    });
  });
});

// Receive messages
socket.on("chat message", (data) => {
  let ch = document.createElement("p");
  ch.classList.add("chat");

  if (data.type === "text") {
    ch.innerHTML = `<b>${data.user}:</b> ${data.content}`;
  } 
  else if (data.type === "image") {
    ch.innerHTML = `<b>${data.user}:</b><br><img src="${data.content}" width="200">`;
     ch.style.backgroundColor = "transparent"; // no background
     ch.style.color = "blue";
    ch.style.padding = "0";   
  } 
  else if (data.type === "sticker") {
    ch.innerHTML = `<b>${data.user}:</b><br><img src="${data.content}" width="80">`;
  }

  chatbox.append(ch);
  chatbox.scrollTop = chatbox.scrollHeight;
});

// Update online members
socket.on("online users", (users) => {
  onlinemembers.innerHTML = "";
  users.forEach(user => {
    let li = document.createElement("p");
    li.classList.add("onlineme");
    li.textContent = user;
    onlinemembers.append(li);
  });
});
