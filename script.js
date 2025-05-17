const channelName = "user";

const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

socket.onopen = () => {
  console.log("Conectado ao chat da Twitch!");

  // Conexão anônima
  socket.send("PASS oauth:anonymous");
  socket.send("NICK justinfan12345");
  socket.send(`JOIN #${channelName}`);
};

socket.onmessage = (event) => {
  const msg = event.data;
  console.log("Mensagem recebida:", msg); // Ver tudo que chega

  // Mantém conexão viva
  if (msg.startsWith("PING")) {
    socket.send("PONG :tmi.twitch.tv");
    return;
  }

  // Verifica se é mensagem de chat
  if (msg.includes("PRIVMSG")) {
    const [prefix, fullMessage] = msg.split("PRIVMSG");
    const username = prefix.split("!")[0].slice(1);
    const message = fullMessage.split(" :")[1];

    displayMessage(username, message);
  }
};

const userColors = {};
const colorPalette = [
  "#FF69B4", "#00CED1", "#ADFF2F", "#FFA500", "#BA55D3", "#87CEEB", "#FF4500", "#40E0D0"
];

function getColorForUser(username) {
  if (!userColors[username]) {
    // Atribui uma cor da paleta, em loop
    const colorIndex = Object.keys(userColors).length % colorPalette.length;
    userColors[username] = colorPalette[colorIndex];
  }
  return userColors[username];
}


function displayMessage(user, text) {
  const chat = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.classList.add("message");

  const usernameColor = getColorForUser(user);

  div.innerHTML = `
  <div class="username-box" style="background-color: ${usernameColor};">${user}</div>
  <div class="message-text">${text}</div>
`;


  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


